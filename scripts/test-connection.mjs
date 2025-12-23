import postgres from 'postgres';
import dotenv from 'dotenv';
import fs from 'fs';

// Load env vars manually to ensure we see exactly what Next.js sees
const envLocal = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';
const env = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';

// Parse basic KEY=VAL
function parse(src) {
    const res = {};
    src.split('\n').forEach(line => {
        const m = line.match(/^([^=]+)=(.*)$/);
        if (m) res[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
    });
    return res;
}

const config = { ...parse(env), ...parse(envLocal) };
const url = config.DATABASE_URL;

console.log('Testing connection to:', url ? url.replace(/:[^:@]*@/, ':****@') : 'NO URL FOUND');

if (!url) {
    process.exit(1);
}

const sql = postgres(url, {
    prepare: false,
    connect_timeout: 10,
    ssl: { rejectUnauthorized: false } // Try permissive SSL
});

try {
    const version = await sql`SELECT version()`;
    console.log('✅ Connection Successful!');
    console.log('Version:', version[0].version);
} catch (e) {
    console.error('❌ Connection Failed');
    console.error('Error config:', {
        code: e.code,
        errno: e.errno,
        syscall: e.syscall,
        address: e.address,
        port: e.port
    });
    console.error('Full Error:', e);
} finally {
    await sql.end();
}
