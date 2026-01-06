import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { regions, zipCodes } from '../drizzle/schema';

const DATABASE_URL = process.env.DATABASE_URL!;

async function seedDeliveryZones() {
  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  try {
    console.log('Seeding delivery zones...');

    // Insert regions
    const regionData = [
      { name: 'San Fernando Valley', deliveryFeeCents: 500, minimumOrderCents: 2000 },
      { name: 'Los Angeles', deliveryFeeCents: 1000, minimumOrderCents: 3000 },
      { name: 'Orange County', deliveryFeeCents: 1500, minimumOrderCents: 3500 },
    ];

    for (const region of regionData) {
      await db.insert(regions).values(region).onConflictDoNothing();
    }

    console.log('Regions seeded ✓');

    // Get region IDs
    const allRegions = await db.select().from(regions);
    const sfvRegion = allRegions.find(r => r.name === 'San Fernando Valley');

    if (!sfvRegion) {
      throw new Error('SFV region not found');
    }

    // San Fernando Valley ZIP codes
    const sfvZips = [
      '91301', '91302', '91303', '91304', '91306', '91307', '91311', '91316',
      '91324', '91325', '91326', '91330', '91335', '91340', '91342', '91343',
      '91344', '91345', '91350', '91351', '91352', '91354', '91355', '91356',
      '91360', '91361', '91362', '91364', '91367', '91371', '91377', '91381',
      '91384', '91387', '91401', '91402', '91403', '91405', '91406', '91411',
      '91423', '91436', '91504', '91505', '91506', '91607', '91608',
    ];

    for (const zip of sfvZips) {
      await db.insert(zipCodes).values({
        zip,
        regionId: sfvRegion.id,
        isActive: true,
      }).onConflictDoNothing();
    }

    console.log(`${sfvZips.length} ZIP codes seeded for SFV ✓`);
    console.log('Delivery zones seeded successfully! ✓');

    await client.end();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedDeliveryZones();
