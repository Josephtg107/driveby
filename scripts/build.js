const { execSync } = require('child_process');

console.log('🔧 Starting build process...');

try {
  // Check if DATABASE_URL is available
  if (process.env.DATABASE_URL) {
    console.log('✅ DATABASE_URL found, generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
  } else {
    console.log('⚠️  No DATABASE_URL found, skipping Prisma generation...');
  }
  
  console.log('🏗️  Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
