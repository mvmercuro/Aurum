-- Seed delivery zones for immediate use
-- Run this with: psql <your-database-url> < scripts/seed-delivery-zones.sql

-- Insert regions
INSERT INTO regions (name, "deliveryFeeCents", "minimumOrderCents", "isActive") VALUES
('San Fernando Valley', 500, 2000, true),
('Los Angeles', 1000, 3000, true),
('Orange County', 1500, 3500, true)
ON CONFLICT (name) DO NOTHING;

-- Insert ZIP codes for SFV (Region 1)
INSERT INTO "zipCodes" (zip, "regionId", "isActive")
SELECT zip, 1, true FROM (VALUES
    ('91301'),  -- Agoura Hills
    ('91302'),  -- Calabasas
    ('91303'),  -- Canoga Park
    ('91304'),  -- Canoga Park
    ('91306'),  -- Winnetka
    ('91307'),  -- West Hills
    ('91311'),  -- Chatsworth
    ('91316'),  -- Encino
    ('91324'),  -- Northridge
    ('91325'),  -- Northridge
    ('91326'),  -- Porter Ranch
    ('91330'),  -- Northridge
    ('91335'),  -- Reseda
    ('91340'),  -- San Fernando
    ('91342'),  -- Sylmar
    ('91343'),  -- North Hills
    ('91344'),  -- Granada Hills
    ('91345'),  -- Mission Hills
    ('91350'),  -- Santa Clarita
    ('91351'),  -- Canyon Country
    ('91352'),  -- Sun Valley
    ('91354'),  -- Valencia
    ('91355'),  -- Valencia
    ('91356'),  -- Tarzana
    ('91360'),  -- Thousand Oaks
    ('91361'),  -- Westlake Village
    ('91362'),  -- Thousand Oaks
    ('91364'),  -- Woodland Hills
    ('91367'),  -- Woodland Hills
    ('91371'),  -- Woodland Hills
    ('91377'),  -- Oak Park
    ('91381'),  -- Stevenson Ranch
    ('91384'),  -- Castaic
    ('91387'),  -- Canyon Country
    ('91401'),  -- Van Nuys
    ('91402'),  -- Panorama City
    ('91403'),  -- Sherman Oaks
    ('91405'),  -- Van Nuys
    ('91406'),  -- Van Nuys
    ('91411'),  -- Van Nuys
    ('91423'),  -- Sherman Oaks
    ('91436'),  -- Encino
    ('91504'),  -- Burbank
    ('91505'),  -- Burbank
    ('91506'),  -- Burbank
    ('91607'),  -- Valley Village
    ('91608')   -- Universal City
) AS v(zip)
ON CONFLICT (zip) DO NOTHING;

-- Output confirmation
SELECT 'Delivery zones seeded successfully!' AS message;
SELECT COUNT(*) AS total_regions FROM regions;
SELECT COUNT(*) AS total_zip_codes FROM "zipCodes";
