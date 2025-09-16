import { prisma } from '@/server/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { locationId: string; qrSlug: string } }) {
  try {
    const { locationId, qrSlug } = params;

    const spot = await prisma.parkingSpot.findFirst({
      where: { locationId, qrSlug },
      include: { location: { include: { business: true } } },
    });

    if (!spot || !spot.location?.business) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const res = NextResponse.redirect(new URL('/menu', req.url));
    res.cookies.set('parkingSpotId', spot.id, { path: '/', maxAge: 60 * 60 * 6 });
    res.cookies.set('businessId', spot.location.business.id, { path: '/', maxAge: 60 * 60 * 6 });
    return res;
  } catch (e) {
    console.error('QR route error', e);
    return NextResponse.redirect(new URL('/', req.url));
  }
}

