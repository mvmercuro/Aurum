import postgres from 'postgres';

const projectRef = 'jktgrilntsyjckczbpkd';
const password = 'HW6GYwiRGrnTeQOb';

const configs = [
    {
        name: 'Pooler (Mode: Transaction)',
        url: `postgresql://postgres.${projectRef}:${password}@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true`,
        ssl: { rejectUnauthorized: false }
    },
    {
        name: 'Direct (Port 5432)',
        url: `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
        ssl: true
    }
];

async function test(name, url, ssl) {
    console.log(`\nTesting ${name}...`);
    // Mask password in logs
    console.log(`URL: ${url.replace(password, '****')}`);

    const sql = postgres(url, {
        prepare: false,
        connect_timeout: 10,
        ssl: ssl
    });

    try {
        const version = await sql`SELECT version()`;
        console.log(`✅ SUCCESS! Version: ${version[0].version}`);
        return true;
    } catch (e) {
        console.log(`❌ FAILED: ${e.code || e.message}`);
        if (e.code !== '28P01') console.log(e); // Show full error if not auth failure
        return false;
    } finally {
        await sql.end();
    }
}

async function run() {
    for (const config of configs) {
        await test(config.name, config.url, config.ssl);
    }
}

run();
