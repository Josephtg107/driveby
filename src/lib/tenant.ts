import { headers } from 'next/headers';

export interface TenantInfo {
  businessSlug: string;
  locationId: string;
}

export async function getTenantByHost() {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost';
    
    // For now, return a default tenant for the demo
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
  } catch (error) {
    console.error('Error getting tenant:', error);
    return null;
  }
}
