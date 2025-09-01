import { headers } from 'next/headers';

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
    const host = headersList.get('host') || 'localhost';
    
    // For localhost, return null so it shows the business selection page
    if (host === 'localhost:3000' || host === 'localhost') {
      return null;
    }

    // For production domains, you would query the database to get the tenant based on domain
    // For now, return a default tenant for demo domains
    if (host.includes('drivebyapp.com')) {
      return {
        businessSlug: 'drivebyapp',
        locationId: 'demo-location',
        theme: {
          primary: '#111827',
          accent: '#22C55E',
          text: '#0B1020',
          currency: 'MXN'
        }
      };
    }

    if (host.includes('cafeshop.drivebyapp.com')) {
      return {
        businessSlug: 'cafeshop',
        locationId: 'adc-location',
        theme: {
          primary: '#1F2937',
          accent: '#F59E0B',
          text: '#0B1020',
          currency: 'MXN'
        }
      };
    }

    if (host.includes('pizzaexpress.drivebyapp.com')) {
      return {
        businessSlug: 'pizzaexpress',
        locationId: 'pizza-location',
        theme: {
          primary: '#DC2626',
          accent: '#FCD34D',
          text: '#0B1020',
          currency: 'MXN'
        }
      };
    }

    // Default fallback
    return null;
  } catch (error) {
    console.error('Error getting tenant:', error);
    return null;
  }
}


