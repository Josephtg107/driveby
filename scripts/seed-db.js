const { execSync } = require('child_process');

console.log('🌱 Starting database seeding...');

try {
  // Check if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL found, seeding database...');
    
    // Generate Prisma client first
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Push schema to database
    console.log('🗄️  Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    // Seed the database
    console.log('🌱 Seeding database with demo data...');
    execSync('npm run db:seed', { stdio: 'inherit' });
    
    // Generate QR codes
    console.log('📱 Generating QR codes...');
    execSync('npm run qr:gen', { stdio: 'inherit' });
    
    console.log('✅ Database seeded successfully!');
  } else {
    console.log('❌ No DATABASE_URL found. Please set the DATABASE_URL environment variable.');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
}

