import { NextResponse } from 'next/server';
import { db } from '@/lib/data';
import { Order } from '@/types';

export async function GET() {
  return NextResponse.json(db.orders);
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const id = body?.id as string | undefined;
  const status = body?.status as Order['status'] | undefined;

  if (!id || !status) {
    return NextResponse.json({ message: 'ID and status are required' }, { status: 400 });
  }

  const order = db.orders.find((item) => item.id === id);
  if (!order) {
    return NextResponse.json({ message: 'Order not found' }, { status: 404 });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();

  return NextResponse.json(order);
}
