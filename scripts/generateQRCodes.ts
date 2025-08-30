import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function generateQRCodes() {
  console.log('Generando códigos QR para todos los negocios...');

  const businesses = await prisma.business.findMany({
    include: {
      locations: {
        include: {
          parkingSpots: true
        }
      }
    }
  });

  const qrData: Array<{
    business: string;
    location: string;
    spot: string;
    code: string;
    url: string;
  }> = [];

  for (const business of businesses) {
    console.log(`\nProcesando: ${business.name}`);
    
    for (const location of business.locations) {
      console.log(`  Ubicación: ${location.name}`);
      
      for (const spot of location.parkingSpots) {
        const url = `http://localhost:3001/l/${location.id}/s/${spot.qrSlug}`;
        
        // Create QR code
        const qrCodeDataURL = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        // Convert data URL to buffer
        const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Create directory structure
        const qrDir = path.join(process.cwd(), 'public', 'qr', business.slug, location.id);
        fs.mkdirSync(qrDir, { recursive: true });

        // Save QR code image
        const filename = `${spot.code}.png`;
        const filepath = path.join(qrDir, filename);
        fs.writeFileSync(filepath, buffer);

        console.log(`    ✅ ${spot.code} -> ${url}`);

        qrData.push({
          business: business.name,
          location: location.name,
          spot: spot.code,
          code: spot.qrSlug,
          url: url
        });
      }
    }
  }

  // Generate CSV index
  const csvContent = [
    'Business,Location,Spot,Code,URL',
    ...qrData.map(item => `${item.business},${item.location},${item.spot},${item.code},${item.url}`)
  ].join('\n');

  const csvPath = path.join(process.cwd(), 'public', 'qr', 'qr_index.csv');
  fs.writeFileSync(csvPath, csvContent);

  console.log(`\n🎉 ¡Completado! Se generaron ${qrData.length} códigos QR`);
  console.log(`📁 Archivos guardados en: /public/qr/`);
  console.log(`📊 Índice CSV: /public/qr/qr_index.csv`);

  console.log('\n📋 Resumen por negocio:');
  const businessSummary = businesses.map(business => {
    const totalSpots = business.locations.reduce((acc, loc) => acc + loc.parkingSpots.length, 0);
    return `  ${business.name}: ${totalSpots} cajones`;
  });
  console.log(businessSummary.join('\n'));
}

generateQRCodes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
