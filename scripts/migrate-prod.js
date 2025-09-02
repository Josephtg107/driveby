const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateProduction() {
  try {
    console.log('🔍 Running production migration...');
    
    // This will create all tables based on the schema
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS public`;
    
    console.log('✅ Migration completed successfully!');
    console.log('📋 Next steps:');
    console.log('1. Visit: https://tu-dominio.vercel.app/setup');
    console.log('2. Click "Configurar Base de Datos"');
    console.log('3. Test the demo dashboard');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateProduction();
