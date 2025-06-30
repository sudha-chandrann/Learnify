import { NextRequest, NextResponse } from 'next/server';
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

    await db.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date(),
      },
    });

    await db.purchase.delete({
      where: {
        id: transaction.purchaseId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment cancelled successfully',
      orderID,
    });
  } catch (error) {
    console.error('PayPal Cancel Order Error:', error);
    
    return NextResponse.json(
      { error: 'Failed to cancel PayPal order' },
      { status: 500 }
    );
  }
}