import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/lib/paypal';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const transaction = await db.transaction.findUnique({
      where: {
        paypalOrderId: orderID,
      },
      include: {
        purchase: true,
        course: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    if (transaction.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized transaction access' },
        { status: 403 }
      );
    }

    const paypalClient = client();
    const captureRequest = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    captureRequest.requestBody({ payment_source: {} as any });

    const capture = await paypalClient.execute(captureRequest);
    const captureResult = capture.result;

    const transactionStatus = captureResult.status === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
    
    const updatedTransaction = await db.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        status: transactionStatus,
        payerEmail: captureResult.payer?.email_address,
        paypalData: captureResult,
        updatedAt: new Date(),
      },
    });

    if (transactionStatus === 'FAILED') {
      await db.purchase.delete({
        where: {
          id: transaction.purchaseId,
        },
      });

      return NextResponse.json(
        { error: 'Payment failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      orderID: captureResult.id,
      status: captureResult.status,
      transactionId: updatedTransaction.id,
      purchaseId: transaction.purchaseId,
      courseId: transaction.courseId,
      amount: {
        value: transaction.amount,
        currency: transaction.currency,
      },
      payerEmail: captureResult.payer?.email_address,
    });
  } catch (error) {
    console.error('PayPal Capture Order Error:', error);
    
    try {
      const { orderID } = await request.json().catch(() => ({}));
      
      if (orderID) {
        const transaction = await db.transaction.findUnique({
          where: {
            paypalOrderId: orderID,
          },
        });

        if (transaction) {
          await db.transaction.update({
            where: {
              id: transaction.id,
            },
            data: {
              status: 'FAILED',
              updatedAt: new Date(),
            },
          });

          await db.purchase.delete({
            where: {
              id: transaction.purchaseId,
            },
          });
        }
      }
    } catch (cleanupError) {
      console.error('Failed to cleanup purchase on error:', cleanupError);
    }

    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    );
  }
}