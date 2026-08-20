import { execSync } from 'child_process';
import { config } from 'dotenv';

config({ path: '.env.local' });

try {
  console.log('Running Prisma migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✓ Migration successful!');
  process.exit(0);
} catch (err) {
  console.error('✗ Migration failed:', err.message);
  process.exit(1);
}
