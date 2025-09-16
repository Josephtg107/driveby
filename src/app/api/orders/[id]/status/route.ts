import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/server/db';

type RouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const rawId = params?.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }
    const form = await req.formData();
    const status = form.get('status');
    const validStatuses = new Set(['pending', 'preparing', 'ready', 'completed', 'cancelled']);
    if (typeof status !== 'string' || !validStatuses.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    await prisma.order.update({ where: { id }, data: { status } });
    // Redirect back to dashboard orders
    return NextResponse.redirect(new URL('/dashboard/orders', req.url));
  } catch (error) {
    console.error('POST /api/orders/[id]/status', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
