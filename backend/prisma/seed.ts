import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data (order matters for foreign keys)
  await prisma.offer.deleteMany();
  await prisma.produceListing.deleteMany();
  await prisma.marketPrice.deleteMany();
  await prisma.market.deleteMany();
  // Don't delete users/commodities, upsert them

  // ──────────────────────────────────────
  // COMMODITIES (15)
  // ──────────────────────────────────────
  const commoditiesData = [
    { name: 'Soybean', category: 'Oilseeds' },
    { name: 'Wheat', category: 'Cereals' },
    { name: 'Rice (Paddy)', category: 'Cereals' },
    { name: 'Onion', category: 'Vegetables' },
    { name: 'Tomato', category: 'Vegetables' },
    { name: 'Potato', category: 'Vegetables' },
    { name: 'Cotton', category: 'Fibers' },
    { name: 'Maize', category: 'Cereals' },
    { name: 'Chickpea (Chana)', category: 'Pulses' },
    { name: 'Mustard', category: 'Oilseeds' },
    { name: 'Groundnut', category: 'Oilseeds' },
    { name: 'Sugarcane', category: 'Cash Crops' },
    { name: 'Jowar (Sorghum)', category: 'Cereals' },
    { name: 'Bajra (Pearl Millet)', category: 'Cereals' },
    { name: 'Tur (Pigeon Pea)', category: 'Pulses' },
  ];

  const commodities: Record<string, any> = {};
  for (const c of commoditiesData) {
    const created = await prisma.commodity.upsert({
      where: { name: c.name },
      update: { category: c.category },
      create: c,
    });
    commodities[c.name] = created;
  }

  // ──────────────────────────────────────
  // MARKETS (22 real Indian APMCs)
  // Distances are approximate from Nashik, MH
  // ──────────────────────────────────────
  const marketsData = [
    { name: 'Lasalgaon APMC', state: 'Maharashtra', district: 'Nashik', distance: 35.5 },
    { name: 'Nashik APMC', state: 'Maharashtra', district: 'Nashik', distance: 12.0 },
    { name: 'Pune APMC', state: 'Maharashtra', district: 'Pune', distance: 210.0 },
    { name: 'Vashi APMC (Navi Mumbai)', state: 'Maharashtra', district: 'Thane', distance: 175.0 },
    { name: 'Ahmednagar APMC', state: 'Maharashtra', district: 'Ahmednagar', distance: 120.0 },
    { name: 'Latur APMC', state: 'Maharashtra', district: 'Latur', distance: 420.0 },
    { name: 'Solapur APMC', state: 'Maharashtra', district: 'Solapur', distance: 390.0 },
    { name: 'Kolhapur APMC', state: 'Maharashtra', district: 'Kolhapur', distance: 380.0 },
    { name: 'Indore APMC', state: 'Madhya Pradesh', district: 'Indore', distance: 590.0 },
    { name: 'Ujjain Mandi', state: 'Madhya Pradesh', district: 'Ujjain', distance: 620.0 },
    { name: 'Mandsaur APMC', state: 'Madhya Pradesh', district: 'Mandsaur', distance: 560.0 },
    { name: 'Khandwa APMC', state: 'Madhya Pradesh', district: 'Khandwa', distance: 480.0 },
    { name: 'Rajkot APMC', state: 'Gujarat', district: 'Rajkot', distance: 680.0 },
    { name: 'Gondal APMC', state: 'Gujarat', district: 'Rajkot', distance: 700.0 },
    { name: 'Azadpur Mandi', state: 'Delhi', district: 'North Delhi', distance: 1150.0 },
    { name: 'Karnal Mandi', state: 'Haryana', district: 'Karnal', distance: 1250.0 },
    { name: 'Jaipur Mandi', state: 'Rajasthan', district: 'Jaipur', distance: 920.0 },
    { name: 'Kota APMC', state: 'Rajasthan', district: 'Kota', distance: 780.0 },
    { name: 'Nizamabad Mandi', state: 'Telangana', district: 'Nizamabad', distance: 550.0 },
    { name: 'Hubli APMC', state: 'Karnataka', district: 'Dharwad', distance: 520.0 },
    { name: 'Davangere APMC', state: 'Karnataka', district: 'Davangere', distance: 620.0 },
    { name: 'Lucknow Mandi', state: 'Uttar Pradesh', district: 'Lucknow', distance: 1100.0 },
  ];

  const markets: Record<string, any> = {};
  for (const m of marketsData) {
    const created = await prisma.market.create({ data: m });
    markets[m.name] = created;
  }

  // ──────────────────────────────────────
  // MARKET PRICES (55 entries)
  // Realistic INR/quintal prices
  // ──────────────────────────────────────
  const prices = [
    // Soybean
    { market: 'Indore APMC', commodity: 'Soybean', min: 4500, max: 4850, modal: 4680 },
    { market: 'Latur APMC', commodity: 'Soybean', min: 4400, max: 4750, modal: 4570 },
    { market: 'Ujjain Mandi', commodity: 'Soybean', min: 4350, max: 4650, modal: 4510 },
    { market: 'Mandsaur APMC', commodity: 'Soybean', min: 4480, max: 4800, modal: 4640 },
    { market: 'Ahmednagar APMC', commodity: 'Soybean', min: 4200, max: 4550, modal: 4380 },
    { market: 'Khandwa APMC', commodity: 'Soybean', min: 4420, max: 4700, modal: 4560 },
    { market: 'Nashik APMC', commodity: 'Soybean', min: 4180, max: 4500, modal: 4340 },

    // Wheat
    { market: 'Karnal Mandi', commodity: 'Wheat', min: 2150, max: 2380, modal: 2265 },
    { market: 'Indore APMC', commodity: 'Wheat', min: 2200, max: 2580, modal: 2390 },
    { market: 'Jaipur Mandi', commodity: 'Wheat', min: 2100, max: 2450, modal: 2280 },
    { market: 'Lucknow Mandi', commodity: 'Wheat', min: 2050, max: 2350, modal: 2200 },
    { market: 'Kota APMC', commodity: 'Wheat', min: 2180, max: 2500, modal: 2340 },

    // Rice (Paddy)
    { market: 'Karnal Mandi', commodity: 'Rice (Paddy)', min: 2900, max: 3400, modal: 3150 },
    { market: 'Lucknow Mandi', commodity: 'Rice (Paddy)', min: 2850, max: 3350, modal: 3100 },
    { market: 'Nizamabad Mandi', commodity: 'Rice (Paddy)', min: 3000, max: 3500, modal: 3250 },
    { market: 'Davangere APMC', commodity: 'Rice (Paddy)', min: 2950, max: 3300, modal: 3120 },

    // Onion
    { market: 'Lasalgaon APMC', commodity: 'Onion', min: 1800, max: 2450, modal: 2120 },
    { market: 'Nashik APMC', commodity: 'Onion', min: 1750, max: 2350, modal: 2050 },
    { market: 'Pune APMC', commodity: 'Onion', min: 1900, max: 2550, modal: 2230 },
    { market: 'Vashi APMC (Navi Mumbai)', commodity: 'Onion', min: 2100, max: 2850, modal: 2480 },
    { market: 'Azadpur Mandi', commodity: 'Onion', min: 2200, max: 3000, modal: 2600 },
    { market: 'Solapur APMC', commodity: 'Onion', min: 1700, max: 2300, modal: 2000 },

    // Tomato
    { market: 'Nashik APMC', commodity: 'Tomato', min: 850, max: 1800, modal: 1320 },
    { market: 'Pune APMC', commodity: 'Tomato', min: 900, max: 2000, modal: 1450 },
    { market: 'Vashi APMC (Navi Mumbai)', commodity: 'Tomato', min: 1100, max: 2200, modal: 1650 },
    { market: 'Azadpur Mandi', commodity: 'Tomato', min: 1200, max: 2500, modal: 1850 },

    // Potato
    { market: 'Azadpur Mandi', commodity: 'Potato', min: 1300, max: 1800, modal: 1550 },
    { market: 'Lucknow Mandi', commodity: 'Potato', min: 1200, max: 1700, modal: 1450 },
    { market: 'Jaipur Mandi', commodity: 'Potato', min: 1250, max: 1750, modal: 1500 },
    { market: 'Pune APMC', commodity: 'Potato', min: 1400, max: 1900, modal: 1650 },

    // Cotton
    { market: 'Rajkot APMC', commodity: 'Cotton', min: 6800, max: 7400, modal: 7100 },
    { market: 'Gondal APMC', commodity: 'Cotton', min: 6900, max: 7500, modal: 7200 },
    { market: 'Hubli APMC', commodity: 'Cotton', min: 6600, max: 7200, modal: 6900 },
    { market: 'Khandwa APMC', commodity: 'Cotton', min: 6700, max: 7300, modal: 7000 },

    // Maize
    { market: 'Davangere APMC', commodity: 'Maize', min: 1850, max: 2150, modal: 2000 },
    { market: 'Nizamabad Mandi', commodity: 'Maize', min: 1800, max: 2100, modal: 1950 },
    { market: 'Indore APMC', commodity: 'Maize', min: 1900, max: 2200, modal: 2050 },

    // Chickpea (Chana)
    { market: 'Indore APMC', commodity: 'Chickpea (Chana)', min: 4800, max: 5400, modal: 5100 },
    { market: 'Jaipur Mandi', commodity: 'Chickpea (Chana)', min: 4700, max: 5300, modal: 5000 },
    { market: 'Latur APMC', commodity: 'Chickpea (Chana)', min: 4600, max: 5200, modal: 4900 },
    { market: 'Kota APMC', commodity: 'Chickpea (Chana)', min: 4750, max: 5350, modal: 5050 },

    // Mustard
    { market: 'Jaipur Mandi', commodity: 'Mustard', min: 4900, max: 5400, modal: 5150 },
    { market: 'Kota APMC', commodity: 'Mustard', min: 5000, max: 5500, modal: 5250 },

    // Groundnut
    { market: 'Rajkot APMC', commodity: 'Groundnut', min: 5200, max: 5800, modal: 5500 },
    { market: 'Gondal APMC', commodity: 'Groundnut', min: 5100, max: 5700, modal: 5400 },

    // Sugarcane
    { market: 'Kolhapur APMC', commodity: 'Sugarcane', min: 290, max: 340, modal: 315 },
    { market: 'Solapur APMC', commodity: 'Sugarcane', min: 280, max: 330, modal: 305 },
    { market: 'Ahmednagar APMC', commodity: 'Sugarcane', min: 285, max: 335, modal: 310 },

    // Jowar (Sorghum)
    { market: 'Solapur APMC', commodity: 'Jowar (Sorghum)', min: 2900, max: 3400, modal: 3150 },
    { market: 'Hubli APMC', commodity: 'Jowar (Sorghum)', min: 2800, max: 3300, modal: 3050 },

    // Bajra (Pearl Millet)
    { market: 'Jaipur Mandi', commodity: 'Bajra (Pearl Millet)', min: 2300, max: 2700, modal: 2500 },
    { market: 'Rajkot APMC', commodity: 'Bajra (Pearl Millet)', min: 2250, max: 2650, modal: 2450 },

    // Tur (Pigeon Pea)
    { market: 'Latur APMC', commodity: 'Tur (Pigeon Pea)', min: 7200, max: 8800, modal: 8000 },
    { market: 'Indore APMC', commodity: 'Tur (Pigeon Pea)', min: 7400, max: 9000, modal: 8200 },
    { market: 'Hubli APMC', commodity: 'Tur (Pigeon Pea)', min: 7000, max: 8600, modal: 7800 },
  ];

  for (const p of prices) {
    await prisma.marketPrice.create({
      data: {
        marketId: markets[p.market].id,
        commodityId: commodities[p.commodity].id,
        minPrice: p.min,
        maxPrice: p.max,
        modalPrice: p.modal,
      }
    });
  }

  // ──────────────────────────────────────
  // USERS & PROFILES (Farmer, Buyers, Admin)
  // ──────────────────────────────────────
  const farmerUser = await prisma.user.upsert({
    where: { phone: '9876543210' },
    update: {
      email: 'ramesh.farmer@gmail.com',
      googleId: 'google-farmer-9876543210',
      role: 'farmer',
    },
    create: {
      phone: '9876543210',
      email: 'ramesh.farmer@gmail.com',
      googleId: 'google-farmer-9876543210',
      role: 'farmer',
      farmerProfile: {
        create: {
          name: 'Ramesh Patel',
          location: 'Nashik, Maharashtra',
          storageCapacity: 50,
          transportAccess: true
        }
      }
    },
    include: { farmerProfile: true }
  });

  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { phone: '9000000000' },
    update: {
      email: 'admin@agriconnect.gov.in',
      googleId: 'google-admin-9000000000',
      role: 'admin',
    },
    create: {
      phone: '9000000000',
      email: 'admin@agriconnect.gov.in',
      googleId: 'google-admin-9000000000',
      role: 'admin',
      adminProfile: {
        create: {
          name: 'Dr. Vivek Sharma',
          department: 'Agricultural Marketing Operations & Price Intelligence',
          accessLevel: 'SUPER_ADMIN'
        }
      }
    },
    include: { adminProfile: true }
  });

  const buyerUsers = [
    { phone: '9998887776', email: 'anil@agrawalagro.com', name: 'Anil Agrawal', company: 'Agrawal Agro Processors Pvt Ltd', status: 'VERIFIED', reliability: 94.5, transactions: 245 },
    { phone: '9998887775', email: 'suresh@mehtatrading.in', name: 'Suresh Mehta', company: 'Mehta Trading Co.', status: 'VERIFIED', reliability: 88.0, transactions: 132 },
    { phone: '9998887774', email: 'priya@greenfieldsexports.com', name: 'Priya Deshmukh', company: 'Green Fields Exports', status: 'VERIFIED', reliability: 91.2, transactions: 89 },
    { phone: '9998887773', email: 'rajesh@kumarproduce.com', name: 'Rajesh Kumar', company: 'Kumar Fresh Produce', status: 'VERIFIED', reliability: 72.0, transactions: 18 },
    { phone: '7776665554', email: 'vikram@singhproduce.com', name: 'Vikram Singh', company: 'Singh Produce', status: 'UNVERIFIED', reliability: 45.0, transactions: 3 },
    { phone: '7776665553', email: 'deepak@yadavandsons.in', name: 'Deepak Yadav', company: 'Yadav & Sons', status: 'UNVERIFIED', reliability: 30.0, transactions: 0 },
  ];

  const buyerProfiles: any[] = [];
  for (const b of buyerUsers) {
    const user = await prisma.user.upsert({
      where: { phone: b.phone },
      update: {
        email: b.email,
        googleId: `google-buyer-${b.phone}`,
        role: 'buyer',
      },
      create: {
        phone: b.phone,
        email: b.email,
        googleId: `google-buyer-${b.phone}`,
        role: 'buyer',
        buyerProfile: {
          create: {
            name: b.name,
            companyName: b.company,
            verificationStatus: b.status,
            reliabilityScore: b.reliability,
            completedTransactions: b.transactions,
          }
        }
      },
      include: { buyerProfile: true }
    });
    buyerProfiles.push(user.buyerProfile);
  }

  // ──────────────────────────────────────
  // PRODUCE LISTINGS (3)
  // ──────────────────────────────────────
  const listing1 = await prisma.produceListing.create({
    data: {
      farmerId: farmerUser.farmerProfile!.id,
      commodityId: commodities['Soybean'].id,
      quantity: 25.0,
      expectedPrice: 4600,
      location: 'Nashik, Maharashtra',
      availableDate: new Date(),
    }
  });

  const listing2 = await prisma.produceListing.create({
    data: {
      farmerId: farmerUser.farmerProfile!.id,
      commodityId: commodities['Wheat'].id,
      quantity: 50.0,
      expectedPrice: 2400,
      location: 'Nashik, Maharashtra',
      availableDate: new Date(),
    }
  });

  const listing3 = await prisma.produceListing.create({
    data: {
      farmerId: farmerUser.farmerProfile!.id,
      commodityId: commodities['Onion'].id,
      quantity: 40.0,
      expectedPrice: 2200,
      location: 'Nashik, Maharashtra',
      availableDate: new Date(),
    }
  });

  // ──────────────────────────────────────
  // OFFERS (7 total across listings)
  // ──────────────────────────────────────
  // Soybean offers
  await prisma.offer.create({ data: { listingId: listing1.id, buyerId: buyerProfiles[0]!.id, offerPrice: 4550, quantity: 25.0 } });
  await prisma.offer.create({ data: { listingId: listing1.id, buyerId: buyerProfiles[2]!.id, offerPrice: 4620, quantity: 25.0 } });
  await prisma.offer.create({ data: { listingId: listing1.id, buyerId: buyerProfiles[4]!.id, offerPrice: 4750, quantity: 25.0 } });

  // Wheat offers
  await prisma.offer.create({ data: { listingId: listing2.id, buyerId: buyerProfiles[1]!.id, offerPrice: 2350, quantity: 50.0 } });
  await prisma.offer.create({ data: { listingId: listing2.id, buyerId: buyerProfiles[3]!.id, offerPrice: 2420, quantity: 50.0 } });

  // Onion offers
  await prisma.offer.create({ data: { listingId: listing3.id, buyerId: buyerProfiles[0]!.id, offerPrice: 2180, quantity: 40.0 } });
  await prisma.offer.create({ data: { listingId: listing3.id, buyerId: buyerProfiles[5]!.id, offerPrice: 2350, quantity: 40.0 } });

  console.log('Seeding completed successfully.');
  console.log(`  ${commoditiesData.length} commodities`);
  console.log(`  ${marketsData.length} markets`);
  console.log(`  ${prices.length} price entries`);
  console.log(`  ${buyerUsers.length} buyers`);
  console.log(`  3 listings, 7 offers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
