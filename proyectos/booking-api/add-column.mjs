import pkg from 'pg';
import { config } from 'dotenv';
const { Client } = pkg;

config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    console.log('DATABASE_URL definida:', !!process.env.DATABASE_URL);
    await client.connect();
    console.log('✓ Conectado a PostgreSQL');

    // Verificar si la columna ya existe
    const checkResult = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='bookings' AND column_name='google_calendar_event_id'
    `);

    if (checkResult.rows.length > 0) {
      console.log('✓ La columna google_calendar_event_id ya existe');
      return;
    }

    // Agregar la columna
    await client.query(`
      ALTER TABLE "bookings" ADD COLUMN "google_calendar_event_id" TEXT
    `);
    console.log('✓ Columna google_calendar_event_id agregada exitosamente');

  } catch (err) {
    console.error('✗ Error:', err?.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
