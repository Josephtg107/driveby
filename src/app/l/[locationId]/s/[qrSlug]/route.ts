import { prisma } from '@/server/db';
import { NextResponse, type NextRequest } from 'next/server';

type RouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const rawLocationId = params?.locationId;
    const rawQrSlug = params?.qrSlug;
    const locationId = Array.isArray(rawLocationId) ? rawLocationId[0] : rawLocationId;
    const qrSlug = Array.isArray(rawQrSlug) ? rawQrSlug[0] : rawQrSlug;

    if (!locationId || !qrSlug) {
      return NextResponse.redirect(new URL('/', req.url));
    }

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
