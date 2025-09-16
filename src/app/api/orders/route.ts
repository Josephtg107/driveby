import { NextResponse } from 'next/server';
import { prisma } from '@/server/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const businessId = cookieStore.get('businessId')?.value || undefined;
    const parkingSpotId = cookieStore.get('parkingSpotId')?.value || undefined;

    if (!businessId) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: {
        businessId,
        ...(parkingSpotId ? { parkingSpotId } : {}),
      },
      include: {
        items: {
          include: {
            product: true,
            modifiers: {
              include: {
                modifierOption: true,
              },
            },
          },
        },
        parkingSpot: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('GET /api/orders error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    let businessId = cookieStore.get('businessId')?.value || '';
    let parkingSpotId = cookieStore.get('parkingSpotId')?.value || '';

    const body = await req.json().catch(() => ({}));
    const items: Array<{
      productId: string;
      quantity: number;
      unitPrice?: number;
      modifierOptionIds?: string[];
    }> = body?.items || [];

    if (!items.length) {
      return NextResponse.json({ error: 'No items' }, { status: 400 });
    }

    // Infer businessId if missing using first product
    if (!businessId) {
      const firstProduct = await prisma.product.findUnique({ where: { id: items[0].productId } });
      if (!firstProduct) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
      businessId = firstProduct.businessId;
    }

    // Fallback parking spot: pick any spot from first location of business
    if (!parkingSpotId) {
      const loc = await prisma.location.findFirst({ where: { businessId } });
      if (!loc) return NextResponse.json({ error: 'No location for business' }, { status: 400 });
      const spot = await prisma.parkingSpot.findFirst({ where: { locationId: loc.id } });
      if (!spot) return NextResponse.json({ error: 'No parking spot' }, { status: 400 });
      parkingSpotId = spot.id;
    }

    // Calculate total
    let total = 0;
    for (const it of items) {
      const product = await prisma.product.findUnique({ where: { id: it.productId } });
      if (!product) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
      const base = it.unitPrice ?? Number(product.price);
      let modsSum = 0;
      if (it.modifierOptionIds?.length) {
        const opts = await prisma.modifierOption.findMany({ where: { id: { in: it.modifierOptionIds } } });
        modsSum = opts.reduce((s, o) => s + Number(o.price), 0);
      }
      total += (base + modsSum) * (it.quantity || 1);
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'pending',
        total,
        parkingSpotId,
        businessId,
        items: {
          create: await Promise.all(
            items.map(async (it) => {
              const product = await prisma.product.findUnique({ where: { id: it.productId } });
              const base = it.unitPrice ?? Number(product?.price || 0);
              return {
                quantity: it.quantity,
                price: base, // unit price
                productId: it.productId,
                modifiers: it.modifierOptionIds?.length
                  ? {
                      create: it.modifierOptionIds.map((id) => ({ modifierOptionId: id })),
                    }
                  : undefined,
              };
            })
          ),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('POST /api/orders error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

