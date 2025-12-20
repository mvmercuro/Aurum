import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const db = drizzle(connection, { schema, mode: "default" });

console.log("🌱 Seeding database...\n");

// 1. Seed Regions
console.log("📍 Creating regions...");
const [sfv, la, oc] = await Promise.all([
  db.insert(schema.regions).values({
    name: "SFV",
    deliveryFeeCents: 500, // $5
    minimumOrderCents: 2500, // $25
    isActive: true,
  }),
  db.insert(schema.regions).values({
    name: "LA",
    deliveryFeeCents: 700, // $7
    minimumOrderCents: 3000, // $30
    isActive: true,
  }),
  db.insert(schema.regions).values({
    name: "OC",
    deliveryFeeCents: 1000, // $10
    minimumOrderCents: 4000, // $40
    isActive: true,
  }),
]);

console.log("✓ Regions created\n");

// 2. Seed ZIP Codes
console.log("📮 Creating ZIP codes...");
const sfvZips = [
  "91324", "91325", "91326", // Northridge
  "91364", "91365", "91367", // Woodland Hills
  "91401", "91405", "91406", "91411", // Van Nuys
  "91403", "91423", // Sherman Oaks
  "91602", "91604", "91607", // North Hollywood
  "91356", // Tarzana
  "91335", "91344", // Granada Hills
];

const laZips = [
  "90001", "90002", "90003", "90004", "90005", "90006", "90007", "90008",
  "90012", "90013", "90014", "90015", "90016", "90017", "90018", "90019",
  "90020", "90021", "90026", "90027", "90028", "90029", "90031", "90032",
  "90033", "90034", "90035", "90036", "90037", "90038", "90039", "90041",
  "90042", "90043", "90044", "90045", "90046", "90047", "90048", "90049",
];

const ocZips = [
  "92602", "92603", "92604", "92606", "92610", "92612", "92614", "92617",
  "92618", "92620", "92625", "92626", "92627", "92629", "92630", "92637",
  "92646", "92647", "92648", "92649", "92651", "92653", "92655", "92656",
  "92657", "92660", "92661", "92662", "92663", "92672", "92673", "92675",
  "92676", "92677", "92678", "92679", "92683", "92688", "92691", "92692",
];

const zipInserts = [
  ...sfvZips.map((zip) => ({ zip, regionId: 1, isActive: true })),
  ...laZips.map((zip) => ({ zip, regionId: 2, isActive: true })),
  ...ocZips.map((zip) => ({ zip, regionId: 3, isActive: true })),
];

await db.insert(schema.zipCodes).values(zipInserts);
console.log(`✓ ${zipInserts.length} ZIP codes created\n`);

// 3. Seed Categories
console.log("📦 Creating categories...");
const categoryInserts = [
  { name: "Flower", sortOrder: 1, isActive: true },
  { name: "Vapes", sortOrder: 2, isActive: true },
  { name: "Edibles", sortOrder: 3, isActive: true },
  { name: "Concentrates", sortOrder: 4, isActive: true },
  { name: "Pre-Rolls", sortOrder: 5, isActive: true },
  { name: "Tinctures", sortOrder: 6, isActive: true },
];

await db.insert(schema.categories).values(categoryInserts);
console.log("✓ Categories created\n");

// 4. Seed Products
console.log("🌿 Creating products...");
const productInserts = [
  // Flower
  {
    name: "Wedding Cake",
    description: "A cross between Cherry Pie and Girl Scout Cookies. Dense, frosty buds with hints of pink and purple. Sweet vanilla and earthy undertones.",
    priceCents: 4500, // $45
    imageUrl: "/images/wedding-cake.jpg",
    categoryId: 1,
    isActive: true,
    inventoryCount: 50,
    thcPercentage: "24.5",
    cbdPercentage: "0.5",
    strainType: "indica",
    brand: "Pacific Stone",
    weight: "3.5g",
    effects: JSON.stringify(["Relaxed", "Happy", "Euphoric"]),
  },
  {
    name: "Blue Dream",
    description: "A sativa-dominant hybrid originating in California. Bright orange hairs and vibrant green leaves. Balanced full-body relaxation with gentle cerebral invigoration.",
    priceCents: 4000, // $40
    imageUrl: "/images/blue-dream.jpg",
    categoryId: 1,
    isActive: true,
    inventoryCount: 75,
    thcPercentage: "21.0",
    cbdPercentage: "0.3",
    strainType: "hybrid",
    brand: "Pacific Stone",
    weight: "3.5g",
    effects: JSON.stringify(["Creative", "Uplifted", "Focused"]),
  },
  {
    name: "Gelato",
    description: "A cross between Sunset Sherbet and Thin Mint GSC. Dark purple and green compact buds. Sweet dessert-like aroma with hints of berry and citrus.",
    priceCents: 5000, // $50
    imageUrl: "/images/gelato.jpg",
    categoryId: 1,
    isActive: true,
    inventoryCount: 40,
    thcPercentage: "26.0",
    cbdPercentage: "0.2",
    strainType: "hybrid",
    brand: "Cannabiotix",
    weight: "3.5g",
    effects: JSON.stringify(["Euphoric", "Relaxed", "Creative"]),
  },
  {
    name: "Jack Herer",
    description: "A sativa-dominant strain named after the cannabis activist. Bright lime green buds with an open structure. Spicy, pine-scented aroma with earthy undertones.",
    priceCents: 4200, // $42
    imageUrl: "/images/jack-herer.jpg",
    categoryId: 1,
    isActive: true,
    inventoryCount: 60,
    thcPercentage: "22.5",
    cbdPercentage: "0.4",
    strainType: "sativa",
    brand: "West Coast Cure",
    weight: "3.5g",
    effects: JSON.stringify(["Energetic", "Creative", "Uplifted"]),
  },
  {
    name: "OG Kush",
    description: "A legendary California strain with unknown origins. Classic pine-green buds covered in sticky resin. Earthy, pine, and woody aroma with hints of fuel.",
    priceCents: 4800, // $48
    imageUrl: "/images/og-kush.jpg",
    categoryId: 1,
    isActive: true,
    inventoryCount: 55,
    thcPercentage: "23.0",
    cbdPercentage: "0.3",
    strainType: "hybrid",
    brand: "Eighth Brother",
    weight: "3.5g",
    effects: JSON.stringify(["Relaxed", "Happy", "Sleepy"]),
  },
  // Vapes
  {
    name: "Stiiizy - Blue Dream Pod",
    description: "Premium cannabis oil extracted using only the finest processes. Potent, pure, and portable. Compatible with Stiiizy battery.",
    priceCents: 3500, // $35
    imageUrl: "/images/vape-category.jpg",
    categoryId: 2,
    isActive: true,
    inventoryCount: 100,
    thcPercentage: "85.0",
    cbdPercentage: "0.1",
    strainType: "hybrid",
    brand: "Stiiizy",
    weight: "1g",
    effects: JSON.stringify(["Uplifted", "Creative", "Focused"]),
  },
  {
    name: "Raw Garden - Wedding Cake Cart",
    description: "Live Resin vape cartridge. Full spectrum cannabis oil with natural terpenes. 510 thread compatible.",
    priceCents: 4000, // $40
    imageUrl: "/images/vape-category.jpg",
    categoryId: 2,
    isActive: true,
    inventoryCount: 80,
    thcPercentage: "82.0",
    cbdPercentage: "0.2",
    strainType: "indica",
    brand: "Raw Garden",
    weight: "1g",
    effects: JSON.stringify(["Relaxed", "Happy", "Euphoric"]),
  },
  // Edibles
  {
    name: "Kiva - Dark Chocolate Bar",
    description: "Rich, dark chocolate infused with premium cannabis oil. 100mg THC per bar, divided into 20 servings of 5mg each.",
    priceCents: 2000, // $20
    imageUrl: "/images/edible-category.jpg",
    categoryId: 3,
    isActive: true,
    inventoryCount: 120,
    thcPercentage: null,
    cbdPercentage: null,
    strainType: null,
    brand: "Kiva",
    weight: "100mg THC",
    effects: JSON.stringify(["Relaxed", "Happy", "Sleepy"]),
  },
  {
    name: "Wyld - Strawberry Gummies",
    description: "Real fruit gummies infused with hybrid cannabis oil. 100mg THC per package, 10mg per gummy.",
    priceCents: 1800, // $18
    imageUrl: "/images/edible-category.jpg",
    categoryId: 3,
    isActive: true,
    inventoryCount: 150,
    thcPercentage: null,
    cbdPercentage: null,
    strainType: "hybrid",
    brand: "Wyld",
    weight: "100mg THC",
    effects: JSON.stringify(["Uplifted", "Creative", "Happy"]),
  },
];

await db.insert(schema.products).values(productInserts);
console.log(`✓ ${productInserts.length} products created\n`);

// 5. Seed Drivers
console.log("🚗 Creating drivers...");
const driverInserts = [
  { name: "Marcus Johnson", phone: "(818) 555-0101", isActive: true },
  { name: "Sarah Chen", phone: "(818) 555-0102", isActive: true },
  { name: "David Rodriguez", phone: "(818) 555-0103", isActive: true },
];

await db.insert(schema.drivers).values(driverInserts);
console.log("✓ Drivers created\n");

await connection.end();

console.log("✅ Database seeded successfully!\n");
console.log("Summary:");
console.log("- 3 regions (SFV, LA, OC)");
console.log(`- ${zipInserts.length} ZIP codes`);
console.log("- 6 categories");
console.log(`- ${productInserts.length} products`);
console.log("- 3 drivers");
