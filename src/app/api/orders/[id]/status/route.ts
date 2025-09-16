import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const form = await req.formData();
    const status = (form.get('status') as string) || '';
    if (!['pending', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    const order = await prisma.order.update({ where: { id }, data: { status } });
    // Redirect back to dashboard orders
    return NextResponse.redirect(new URL('/dashboard/orders', req.url));
  } catch (error) {
    console.error('POST /api/orders/[id]/status', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

