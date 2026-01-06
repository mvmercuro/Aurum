import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

async function runMigration() {
  const sql = postgres(connectionString, { max: 1 });

  try {
    console.log('Connecting to database...');

    // Read the migration file
    const migrationPath = join(__dirname, '../drizzle/0001_great_blue_marvel.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('Running migration...');
    console.log(migrationSQL);

    // Split by statement breakpoint and execute each statement
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const statement of statements) {
      console.log('\nExecuting:', statement.substring(0, 100) + '...');
      await sql.unsafe(statement);
      console.log('✓ Success');
    }

    console.log('\n✓ Migration completed successfully!');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
