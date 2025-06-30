import { NextRequest, NextResponse } from 'next/server';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { client } from '@/lib/paypal';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  let purchaseId: string | null = null;
  let transactionId: string | null = null;

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = await request.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Course already purchased' },
        { status: 400 }
      );
    }

    const purchase = await db.purchase.create({
      data: {
        userId,
        courseId,
        price: course.price,
      },
    });
    purchaseId = purchase.id;

    const paypalClient = client();
    const orderRequest = new checkoutNodeJssdk.orders.OrdersCreateRequest();

    orderRequest.prefer('return=representation');
    orderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: courseId,
          amount: {
            currency_code: 'USD',
            value: course.price.toFixed(2),
          },
          description: `Course: ${course.title}`,
        },
      ],
      application_context: {
        brand_name: 'Learnify',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${courseId}/cancel`,
      },
    });

    const order = await paypalClient.execute(orderRequest);
    const orderID = order.result.id;

    const transaction = await db.transaction.create({
      data: {
        userId,
        courseId,
        purchaseId: purchase.id,
        paypalOrderId: orderID,
        amount: course.price,
        currency: 'USD',
        status: 'PENDING',
        paypalData: order.result,
      },
    });
    transactionId = transaction.id;

    return NextResponse.json({
      orderID,
      purchaseId: purchase.id,
    });
  } catch (error) {
    console.error('PayPal Create Order Error:', error);

    try {
      if (transactionId) {
        await db.transaction.delete({
          where: { id: transactionId },
        });
      }
      if (purchaseId) {
        await db.purchase.delete({
          where: { id: purchaseId },
        });
      }
    } catch (cleanupError) {
      console.error('Failed to cleanup purchase/transaction:', cleanupError);
    }

    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}