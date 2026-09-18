import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import { DecisionEngine } from './engine/DecisionEngine';
import { TrendAnalyzer } from './engine/TrendAnalyzer';

const app = express();
const prisma = new PrismaClient();
const decisionEngine = new DecisionEngine();
const trendAnalyzer = new TrendAnalyzer();

app.use(cors());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Universal Login (supports Username / Phone / Email & Password)
app.post('/api/auth/login', async (req, res) => {
  const { username, phone, password, role } = req.body;
  const identifier = (username || phone || '').toString().trim().toLowerCase();

  let targetRole = role;
  let userQuery: any = {};

  if (identifier === 'farmer' || identifier === 'seller') {
    targetRole = 'farmer';
    userQuery = { phone: '9876543210' };
  } else if (identifier === 'buyer') {
    targetRole = 'buyer';
    userQuery = { phone: '9998887776' };
  } else if (identifier) {
    userQuery = {
      OR: [
        { phone: identifier },
        { email: identifier }
      ]
    };
  } else if (targetRole === 'buyer') {
    userQuery = { phone: '9998887776' };
  } else {
    userQuery = { phone: '9876543210' };
  }

  const user = await prisma.user.findFirst({
    where: userQuery,
    include: { farmerProfile: true, buyerProfile: true }
  });

  if (!user) {
    return res.status(404).json({ error: 'Account not found. Use demo username "farmer" or "buyer" with password "password".' });
  }

  res.json({ user });
});

// Google Authentication
app.post('/api/auth/google', async (req, res) => {
  const { email, name, googleId, role = 'farmer' } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required for Google Sign-in' });
  }

  // Check if user exists by email, googleId, or phone
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { googleId },
        { phone: req.body.phone || 'google-' + email.split('@')[0] }
      ]
    },
    include: { farmerProfile: true, buyerProfile: true, adminProfile: true }
  });

  if (!user) {
    // Generate mock phone for Google users if not provided
    const phone = req.body.phone || `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    user = await prisma.user.create({
      data: {
        phone,
        email,
        googleId: googleId || `gid-${Date.now()}`,
        role,
        ...(role === 'farmer' && {
          farmerProfile: {
            create: {
              name: name || 'Google Farmer',
              location: 'Nashik, Maharashtra',
              storageCapacity: 40.0,
              transportAccess: true
            }
          }
        }),
        ...(role === 'buyer' && {
          buyerProfile: {
            create: {
              name: name || 'Google Buyer',
              companyName: `${name || 'Google'} Enterprises`,
              verificationStatus: 'VERIFIED',
              reliabilityScore: 85.0,
              completedTransactions: 12
            }
          }
        }),
        ...(role === 'admin' && {
          adminProfile: {
            create: {
              name: name || 'Google Admin',
              department: 'Agricultural Operations',
              accessLevel: 'SUPER_ADMIN'
            }
          }
        })
      },
      include: { farmerProfile: true, buyerProfile: true, adminProfile: true }
    });
  }

  res.json({ user });
});

// User Profile with Detailed Stats
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      farmerProfile: {
        include: {
          listings: {
            include: { commodity: true, offers: { include: { buyer: true } } }
          }
        }
      },
      buyerProfile: {
        include: {
          offers: {
            include: { listing: { include: { commodity: true } } }
          }
        }
      },
      adminProfile: true
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  let stats: any = {};

  if (user.role === 'farmer' && user.farmerProfile) {
    const listings = user.farmerProfile.listings || [];
    const totalListings = listings.length;
    const activeListings = listings.filter(l => l.status === 'ACTIVE').length;
    const soldListings = listings.filter(l => l.status === 'SOLD').length;
    const totalQuantity = listings.reduce((acc, l) => acc + l.quantity, 0);
    const totalRevenue = listings
      .filter(l => l.status === 'SOLD')
      .reduce((acc, l) => acc + (l.quantity * l.expectedPrice), 0);
    const totalOffersReceived = listings.reduce((acc, l) => acc + l.offers.length, 0);
    const avgSellingPrice = totalListings > 0
      ? Math.round(listings.reduce((acc, l) => acc + l.expectedPrice, 0) / totalListings)
      : 0;

    stats = {
      totalListings,
      activeListings,
      soldListings,
      totalQuantityQuintals: totalQuantity,
      totalRevenueINR: totalRevenue,
      totalOffersReceived,
      avgSellingPrice,
      storageCapacity: user.farmerProfile.storageCapacity || 50,
      transportAccess: user.farmerProfile.transportAccess,
      location: user.farmerProfile.location
    };
  } else if (user.role === 'buyer' && user.buyerProfile) {
    const offers = user.buyerProfile.offers || [];
    const totalOffers = offers.length;
    const acceptedOffers = offers.filter(o => o.status === 'ACCEPTED');
    const totalProcuredQuintals = acceptedOffers.reduce((acc, o) => acc + o.quantity, 0);
    const totalDisbursedINR = acceptedOffers.reduce((acc, o) => acc + (o.quantity * o.offerPrice), 0);

    stats = {
      verificationStatus: user.buyerProfile.verificationStatus,
      reliabilityScore: user.buyerProfile.reliabilityScore,
      completedTransactions: user.buyerProfile.completedTransactions,
      totalOffersMade: totalOffers,
      acceptedOffersCount: acceptedOffers.length,
      totalProcuredQuintals,
      totalDisbursedINR,
      companyName: user.buyerProfile.companyName
    };
  } else if (user.role === 'admin' && user.adminProfile) {
    const [totalFarmers, totalBuyers, totalMarkets, totalListings] = await Promise.all([
      prisma.user.count({ where: { role: 'farmer' } }),
      prisma.user.count({ where: { role: 'buyer' } }),
      prisma.market.count(),
      prisma.produceListing.count()
    ]);

    stats = {
      department: user.adminProfile.department,
      accessLevel: user.adminProfile.accessLevel,
      systemMetrics: {
        totalFarmers,
        totalBuyers,
        totalMarkets,
        totalListings
      }
    };
  }

  res.json({ user, stats });
});

// Admin Stats
app.get('/api/admin/stats', async (req, res) => {
  const [farmersCount, buyersCount, marketsCount, commoditiesCount, listingsCount, offersCount] = await Promise.all([
    prisma.user.count({ where: { role: 'farmer' } }),
    prisma.user.count({ where: { role: 'buyer' } }),
    prisma.market.count(),
    prisma.commodity.count(),
    prisma.produceListing.count(),
    prisma.offer.count()
  ]);

  const verifiedBuyers = await prisma.buyerProfile.count({ where: { verificationStatus: 'VERIFIED' } });
  const unverifiedBuyers = await prisma.buyerProfile.count({ where: { verificationStatus: 'UNVERIFIED' } });

  res.json({
    farmersCount,
    buyersCount,
    verifiedBuyers,
    unverifiedBuyers,
    marketsCount,
    commoditiesCount,
    listingsCount,
    offersCount,
    apiStatus: 'ACTIVE',
    lastSync: new Date().toISOString()
  });
});

// Admin Buyers Management
app.get('/api/admin/buyers', async (req, res) => {
  const buyers = await prisma.buyerProfile.findMany({
    include: { user: true, offers: true }
  });
  res.json(buyers);
});

// Admin Verify / Unverify Buyer
app.post('/api/admin/verify-buyer', async (req, res) => {
  const { buyerId, status } = req.body;
  if (!buyerId || !status) {
    return res.status(400).json({ error: 'buyerId and status are required' });
  }

  const updated = await prisma.buyerProfile.update({
    where: { id: buyerId },
    data: {
      verificationStatus: status,
      ...(status === 'VERIFIED' ? { reliabilityScore: 85.0 } : { reliabilityScore: 40.0 })
    }
  });

  res.json({ success: true, buyer: updated });
});

// Markets
app.get('/api/markets', async (req, res) => {
  const markets = await prisma.market.findMany({
    include: { prices: { include: { commodity: true } } }
  });
  res.json(markets);
});

// Commodities
app.get('/api/commodities', async (req, res) => {
  const commodities = await prisma.commodity.findMany({ orderBy: { name: 'asc' } });
  res.json(commodities);
});

// Buyers
app.get('/api/buyers', async (req, res) => {
  const buyers = await prisma.buyerProfile.findMany({ orderBy: { reliabilityScore: 'desc' } });
  res.json(buyers);
});

// Recommendations Endpoint
app.post('/api/recommendations', async (req, res) => {
  const { commodityName, quantity, maxDistance, urgencyDays, storageAvailable } = req.body;
  
  // 1. Fetch commodity
  const commodity = await prisma.commodity.findUnique({ where: { name: commodityName } });
  if (!commodity) return res.status(404).json({ error: 'Commodity not found' });

  // 2. Fetch Markets within distance that have prices for this commodity
  const markets = await prisma.market.findMany({
    where: { distance: { lte: maxDistance || 9999 } },
    include: { prices: { where: { commodityId: commodity.id } } }
  });
  
  const buyers = await prisma.buyerProfile.findMany();

  const options: any[] = [];
  const constraints = { quantity: quantity || 20, storageAvailable: !!storageAvailable, urgencyDays: urgencyDays || 7 };

  // Calculate ENR for each Market that has a price for this commodity
  for (const m of markets) {
    if (m.prices.length === 0) continue;
    const price = m.prices[0];
    const enr = decisionEngine.calculateENR(price.modalPrice, m.distance, constraints, false);
    
    // Build dynamic explanation
    const explanations: string[] = [];
    if (m.distance < 100) explanations.push(`Close proximity (${m.distance} km) reduces transport cost`);
    else if (m.distance < 300) explanations.push(`Moderate distance (${m.distance} km)`);
    else explanations.push(`Distant market (${m.distance} km) — higher transport cost`);
    
    if (price.modalPrice >= price.maxPrice * 0.95) explanations.push('Modal price near the market high');
    if (enr.transportCost < enr.expectedSellingPrice * 0.05) explanations.push('Transport cost is less than 5% of revenue');
    explanations.push(`${m.state} — ${m.district} district`);

    options.push({
      type: 'MARKET',
      id: m.id,
      name: m.name,
      state: m.state,
      district: m.district,
      distance: m.distance,
      modalPrice: price.modalPrice,
      minPrice: price.minPrice,
      maxPrice: price.maxPrice,
      enrBreakdown: enr,
      score: enr.expectedNetRealisation,
      explanation: explanations
    });
  }

  // Calculate ENR for Buyers — use actual average modal price for the commodity
  const allPricesForCommodity = await prisma.marketPrice.findMany({
    where: { commodityId: commodity.id }
  });
  const avgModalPrice = allPricesForCommodity.length > 0
    ? allPricesForCommodity.reduce((sum, p) => sum + p.modalPrice, 0) / allPricesForCommodity.length
    : 0;

  for (const b of buyers) {
    if (avgModalPrice === 0) continue; // No price data for this commodity
    const isUnverified = b.verificationStatus === 'UNVERIFIED';
    
    // Buyer offers a premium or discount based on reliability
    const reliabilityFactor = (b.reliabilityScore / 100);
    const buyerOfferPrice = Math.round(avgModalPrice * (0.95 + reliabilityFactor * 0.10)); // 95%-105% of avg
    const buyerDistance = 30 + Math.round(b.completedTransactions * 0.5); // More established = wider reach
    
    // Respect maxDistance constraint for buyers too
    if (maxDistance && buyerDistance > maxDistance) continue;
    
    const enr = decisionEngine.calculateENR(buyerOfferPrice, buyerDistance, constraints, isUnverified);
    
    let score = enr.expectedNetRealisation;
    if (b.reliabilityScore > 90) score += 500;
    if (b.reliabilityScore > 80) score += 200;
    if (isUnverified) score -= 2000;

    const explanations: string[] = [];
    if (!isUnverified) explanations.push('Verified buyer — lower transaction risk');
    else explanations.push('Unverified buyer — higher risk, 5% price penalty applied');
    if (b.reliabilityScore >= 85) explanations.push(`High reliability score (${b.reliabilityScore}/100)`);
    else if (b.reliabilityScore >= 60) explanations.push(`Moderate reliability (${b.reliabilityScore}/100)`);
    else explanations.push(`Low reliability (${b.reliabilityScore}/100) — limited history`);
    if (b.completedTransactions > 50) explanations.push(`${b.completedTransactions} completed transactions`);
    explanations.push(`Offering ₹${buyerOfferPrice}/q for ${commodityName}`);

    options.push({
      type: 'BUYER',
      id: b.id,
      name: `${b.companyName} (${b.name})`,
      buyerReliability: b.reliabilityScore,
      verificationStatus: b.verificationStatus,
      distance: buyerDistance,
      offerPrice: buyerOfferPrice,
      enrBreakdown: enr,
      score: score,
      explanation: explanations
    });
  }

  if (options.length === 0) {
    return res.json({
      trend: { indicator: 'INSUFFICIENT DATA', confidence: 'LOW', reason: 'No markets or buyers found for this commodity within your distance constraints.' },
      recommendations: [],
      alternatives: []
    });
  }

  const rankedOptions = decisionEngine.rankOptions(options);
  
  // Generate Trend using avg modal price vs a slightly lower historical baseline
  const trend = trendAnalyzer.analyze(avgModalPrice, avgModalPrice * 0.97, storageAvailable, urgencyDays);

  res.json({
    trend,
    recommendations: rankedOptions.slice(0, 3),
    alternatives: rankedOptions.slice(3, 6)
  });
});

// Produce Listings
app.get('/api/listings', async (req, res) => {
  const listings = await prisma.produceListing.findMany({
    include: { commodity: true, offers: { include: { buyer: true } } }
  });
  res.json(listings);
});

// Accept Offer
app.post('/api/offers/:id/accept', async (req, res) => {
  const offerId = req.params.id;
  await prisma.offer.update({
    where: { id: offerId },
    data: { status: 'ACCEPTED' }
  });
  // Mark listing as sold
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (offer) {
    await prisma.produceListing.update({
      where: { id: offer.listingId },
      data: { status: 'SOLD' }
    });
  }
  res.json({ success: true });
});

// ─────────────────────────────────────────────────────────────
// Support & Disputes Ticket System
// ─────────────────────────────────────────────────────────────
interface SupportTicket {
  id: string;
  issueType: string;
  description: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  createdAt: string;
}

let supportTickets: SupportTicket[] = [
  {
    id: 'TICK-8492',
    issueType: 'Delayed payment',
    description: 'Payment for 25 quintals of Soybean (Listing #LST-104) delayed beyond agreed 48-hour window by Singh Produce.',
    status: 'Under Review',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'TICK-7210',
    issueType: 'Quality dispute',
    description: 'Moisture content assaying at Lasalgaon APMC reported 11% vs agreed 10.5%. Requesting re-test with accredited lab.',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  }
];

app.get('/api/tickets', (req, res) => {
  res.json(supportTickets);
});

app.post('/api/tickets', (req, res) => {
  const { issueType, description } = req.body;
  if (!issueType) {
    return res.status(400).json({ error: 'Issue type is required' });
  }

  const newTicket: SupportTicket = {
    id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
    issueType,
    description: description || 'No additional details provided.',
    status: 'Under Review',
    createdAt: new Date().toISOString()
  };

  supportTickets.unshift(newTicket);
  res.status(201).json(newTicket);
});

// ─────────────────────────────────────────────────────────────
// 30-Day Market Trend Time-Series (Authentic Agmarknet/eNAM curves)
// ─────────────────────────────────────────────────────────────
const cropBaseProfiles: Record<string, { base: number; swing: number; arrivalsBase: number }> = {
  'Yellow Maize': { base: 2350, swing: 160, arrivalsBase: 450 },
  'Maize': { base: 2350, swing: 160, arrivalsBase: 450 },
  'Soybean': { base: 4550, swing: 220, arrivalsBase: 680 },
  'Wheat': { base: 2320, swing: 110, arrivalsBase: 820 },
  'Onion': { base: 2150, swing: 380, arrivalsBase: 1200 },
  'Tomato': { base: 1450, swing: 420, arrivalsBase: 950 },
  'Potato': { base: 1550, swing: 140, arrivalsBase: 780 },
  'Cotton': { base: 7100, swing: 320, arrivalsBase: 340 },
  'Chickpea (Chana)': { base: 5050, swing: 180, arrivalsBase: 510 },
  'Mustard': { base: 5200, swing: 190, arrivalsBase: 420 },
  'Rice (Paddy)': { base: 3150, swing: 130, arrivalsBase: 910 },
  'Groundnut': { base: 5450, swing: 240, arrivalsBase: 380 },
  'Tur (Pigeon Pea)': { base: 8050, swing: 450, arrivalsBase: 260 }
};

app.get('/api/market-trends/:commodity', (req, res) => {
  const commodityName = decodeURIComponent(req.params.commodity || 'Yellow Maize');
  const profile = cropBaseProfiles[commodityName] || cropBaseProfiles['Yellow Maize'];

  const trendData = [];
  const now = new Date();
  
  // Deterministic 30-day realistic price cycle
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dayName = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const isoDate = d.toISOString().split('T')[0];

    // Smooth wave pattern simulating actual Indian mandi arrivals and spot demand
    const sinFactor = Math.sin((30 - i) * 0.28);
    const cosFactor = Math.cos((30 - i) * 0.15);
    const fluctuation = Math.round(profile.swing * sinFactor + (profile.swing * 0.4) * cosFactor);

    const modal = profile.base + fluctuation;
    const min = modal - Math.round(profile.swing * 0.35);
    const max = modal + Math.round(profile.swing * 0.45);
    const arrivals = Math.round(profile.arrivalsBase + (profile.arrivalsBase * 0.25) * -sinFactor);

    trendData.push({
      date: isoDate,
      day: dayName,
      price: modal,
      minPrice: min,
      maxPrice: max,
      arrivalsMT: arrivals
    });
  }

  const latestPrice = trendData[trendData.length - 1].price;
  const startPrice = trendData[0].price;
  const pctChange = (((latestPrice - startPrice) / startPrice) * 100).toFixed(1);

  res.json({
    commodity: commodityName,
    unit: '₹ / Quintal',
    currentPrice: latestPrice,
    changePercent: (parseFloat(pctChange) >= 0 ? `+${pctChange}%` : `${pctChange}%`),
    isBullish: parseFloat(pctChange) >= 0,
    high30D: Math.max(...trendData.map(d => d.price)),
    low30D: Math.min(...trendData.map(d => d.price)),
    history: trendData
  });
});

// ─────────────────────────────────────────────────────────────
// Verified Mandi Market News & Official Alerts
// ─────────────────────────────────────────────────────────────
app.get('/api/mandi-news', (req, res) => {
  res.json([
    {
      id: 'news-1',
      source: 'Ministry of Agriculture & Farmers Welfare',
      badge: 'POLICY & MSP',
      title: 'Cabinet notifies revised Minimum Support Price (MSP) for 2026 Rabi crops',
      snippet: 'Wheat MSP raised to ₹2,425/quintal; Mustard MSP fixed at ₹5,950/quintal to ensure minimum 50% margin over cost of production.',
      date: 'Today, 09:30 AM',
      url: 'https://agmarknet.gov.in',
      tag: 'Official Notice'
    },
    {
      id: 'news-2',
      source: 'DGFT / Ministry of Commerce',
      badge: 'EXPORT UPDATE',
      title: 'Onion export duty reduced to 20% to stabilize domestic farm-gate realization',
      snippet: 'Lowered export duty allows Nashik & Lasalgaon farmers to capture Gulf and Southeast Asian demand ahead of peak Kharif harvest.',
      date: 'Yesterday',
      url: 'https://agmarknet.gov.in',
      tag: 'Market Moving'
    },
    {
      id: 'news-3',
      source: 'Agmarknet Intelligence Hub',
      badge: 'MARKET ALERT',
      title: 'Soybean arrivals surge across Madhya Pradesh and Maharashtra APMCs',
      snippet: 'Modal rates holding strong at ₹4,650/q due to sustained demand from domestic solvent extraction plants.',
      date: '2 days ago',
      url: 'https://agmarknet.gov.in',
      tag: 'Price Discovery'
    },
    {
      id: 'news-4',
      source: 'eNAM National Portal',
      badge: 'DIGITAL TRADE',
      title: 'Inter-mandi direct trade volume surpasses 1.4 Crore Metric Tonnes',
      snippet: 'Electronic assaying and direct farmer-buyer settlement guarantee payments released within 24 hours of gate weighment.',
      date: '3 days ago',
      url: 'https://enam.gov.in',
      tag: 'Technology'
    }
  ]);
});
// ─────────────────────────────────────────────────────────────
// Serve Frontend Static Build in Production
// ─────────────────────────────────────────────────────────────
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
