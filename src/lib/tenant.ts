import { headers, cookies } from 'next/headers';
import { prisma } from '@/server/db';

export interface Tenant {
  businessSlug: string;
  locationId: string;
  theme: {
    primary: string;
    accent: string;
    text: string;
    currency: string;
  };
}

export async function getTenantByHost() {
  try {
    const headersList = await headers();
    const rawHost = (headersList.get('host') || '').toLowerCase();
    const host = rawHost.replace(/:\d+$/, '');

    // Localhost: intentar resolver por cookie (flujo QR) o por mapeo, si no, mostrar landing
    if (!host || host === 'localhost') {
      const cookieStore = await cookies();
      const businessId = cookieStore.get('businessId')?.value;
      if (businessId) {
        const business = await prisma.business.findUnique({ where: { id: businessId } });
        if (business) {
          const theme = await prisma.theme.findUnique({ where: { businessId } });
          const location = await prisma.location.findFirst({ where: { businessId } });
          return {
            businessSlug: business.slug,
            locationId: location?.id || '',
            theme: {
              primary: theme?.primary || '#111827',
              accent: theme?.accent || '#22C55E',
              text: theme?.text || '#0B1020',
              currency: business.currency
            }
          };
        }
      }
      // Si no hay cookie, continuar a mostrar landing (null)
      return null;
    }

    // Buscar mapeo de dominio exacto en DB
    const mapping = await prisma.domainMapping.findUnique({
      where: { domain: host }
    });

    if (!mapping) {
      return null;
    }

    const business = await prisma.business.findUnique({ where: { id: mapping.businessId } });
    if (!business) return null;

    const theme = await prisma.theme.findUnique({ where: { businessId: business.id } });

    // Elegir ubicación por defecto si aplica (opcional: primera location)
    const location = await prisma.location.findFirst({ where: { businessId: business.id } });

    return {
      businessSlug: business.slug,
      locationId: location?.id || '',
      theme: {
        primary: theme?.primary || '#111827',
        accent: theme?.accent || '#22C55E',
        text: theme?.text || '#0B1020',
        currency: business.currency
      }
    };
  } catch (error) {
    console.error('Error getting tenant:', error);
    return null;
  }
}
