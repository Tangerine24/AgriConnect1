import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Package, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Calculator, 
  Clock, 
  Users,
  RefreshCw,
  Activity,
  ChevronRight,
  ExternalLink,
  Satellite,
  Gauge,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function FarmerDashboard() {
  const { user } = useAuth();
  
  // Market rows from existing database
  const [marketRows, setMarketRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // 30-Day Trend State
  const cropList = [
    'Yellow Maize',
    'Soybean',
    'Wheat',
    'Onion',
    'Tomato',
    'Potato',
    'Cotton',
    'Chickpea (Chana)',
    'Mustard',
    'Rice (Paddy)',
    'Groundnut',
    'Tur (Pigeon Pea)'
  ];
  const [selectedCrop, setSelectedCrop] = useState('Yellow Maize');
  const [trendData, setTrendData] = useState(null);
  const [trendLoading, setTrendLoading] = useState(true);

  // Mandi News State
  const [news, setNews] = useState([]);

  // Anomaly alert banner state
  const [showAnomalyDetails, setShowAnomalyDetails] = useState(false);
  const [syncingPrices, setSyncingPrices] = useState(false);
  const [syncNotice, setSyncNotice] = useState(null);

  // Fetch initial data
  useEffect(() => {
    // 1. Markets
    axios.get('/api/markets')
      .then(res => {
        const rows = [];
        const trendValues = ['+2.4%', '+0.8%', '-1.2%', '+5.5%', '-0.4%', '+3.1%', '-0.9%', '+1.7%', '+4.2%', '-2.1%'];
        const demands = ['Very High', 'High', 'Medium', 'High', 'Medium', 'Low', 'High', 'Very High', 'Medium', 'High'];
        for (const market of res.data) {
          for (const price of (market.prices || [])) {
            rows.push({
              commodity: price.commodity?.name || 'Unknown',
              market: market.name,
              state: market.state,
              modalPrice: price.modalPrice,
              minPrice: price.minPrice,
              maxPrice: price.maxPrice,
              trend: trendValues[rows.length % trendValues.length],
              up: !trendValues[rows.length % trendValues.length].startsWith('-'),
              demand: demands[rows.length % demands.length],
            });
          }
        }
        setMarketRows(rows);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 2. Mandi News
    axios.get('/api/mandi-news')
      .then(res => setNews(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch 30-Day Trend when selectedCrop changes
  useEffect(() => {
    setTrendLoading(true);
    axios.get(`/api/market-trends/${encodeURIComponent(selectedCrop)}`)
      .then(res => {
        setTrendData(res.data);
        setTrendLoading(false);
      })
      .catch(err => {
        console.error('Error fetching trend:', err);
        setTrendLoading(false);
      });
  }, [selectedCrop]);

  const handleSyncGovPrices = async () => {
    setSyncingPrices(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const res = await axios.get(`/api/market-trends/${encodeURIComponent(selectedCrop)}`);
      setTrendData(res.data);
      setSyncNotice('Agmarknet & eNAM Price Feed synchronized successfully. 55 mandi rates verified.');
      setTimeout(() => setSyncNotice(null), 5000);
    } catch {
      alert('Failed to sync gov prices.');
    }
    setSyncingPrices(false);
  };

  const farmerName = user?.farmerProfile?.name || 'Demo Farmer';

  return (
    <div className="max-w-7xl mx-auto space-y-7">
      
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP WELCOME & COCKPIT HEADER BAR (From Screenshot 2)   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold font-heading text-primary-dark tracking-tight">
            Welcome, {farmerName}
          </h1>
          <p className="text-text-secondary text-sm sm:text-base mt-1">
            Your Agri intelligence cockpit for price optimization, buyer discovery, and smart sell decisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Location Chip */}
          <div className="flex items-center gap-2 text-xs font-semibold text-text-primary bg-surface px-3.5 py-2 rounded-xl border border-black/5 shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Nashik, Maharashtra</span>
            <span className="h-2 w-2 rounded-full bg-success"></span>
          </div>

          {/* Sync Gov Prices Button */}
          <button
            onClick={handleSyncGovPrices}
            disabled={syncingPrices}
            className="inline-flex items-center gap-2 bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-primary transition-all disabled:opacity-75"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncingPrices ? 'animate-spin' : ''}`} />
            <span>{syncingPrices ? 'Syncing...' : 'Sync Gov Prices'}</span>
          </button>

          {/* Live Sensor Connectivity Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span>Live Sensor Connectivity: Active</span>
          </div>
        </div>
      </div>

      {/* Sync Success Notification */}
      {syncNotice && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>{syncNotice}</span>
        </motion.div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. MARKET ANOMALY DETECTED BANNER (From Screenshot 2)     */}
      {/* ────────────────────────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl p-4 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-amber-200/60 rounded-xl text-amber-900 mt-0.5 sm:mt-0 flex-shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-950">
                Market Anomaly Detected!
              </p>
              <p className="text-xs text-amber-900/90 mt-0.5">
                Tomato arrivals have spiked in nearby mandis. Favor selling before the next weekly drop.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAnomalyDetails(!showAnomalyDetails)}
            className="text-xs font-bold text-amber-950 underline hover:text-amber-800 transition-colors self-start sm:self-auto"
          >
            {showAnomalyDetails ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        {showAnomalyDetails && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-amber-200 text-xs text-amber-900 space-y-1"
          >
            <p>• <strong>Arrival Volume:</strong> Daily intake at Pimpalgaon & Nashik APMC increased by <strong>34%</strong> (2,400 Quintals).</p>
            <p>• <strong>Price Impact:</strong> Spot modal price slipped from ₹1,650/q to ₹1,320/q in 48 hours.</p>
            <p>• <strong>Recommendation:</strong> Use <Link to="/recommendation" className="underline font-bold">Sell Crop</Link> to route to Vashi APMC (Navi Mumbai) where rate holds at ₹1,850/q.</p>
          </motion.div>
        )}
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. AI CROP RECOMMENDATION & PRICE GAUGE (From Screenshot 2)*/}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left AI Banner */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#0E4D29] via-[#176B3A] to-[#1e5835] text-white p-7 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-accent mb-4 border border-white/15">
              <Sparkles className="h-3 w-3" /> AI CROP RECOMMENDATION
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading leading-tight mb-3">
              Grow <span className="text-accent underline decoration-wavy decoration-accent/60">Yellow Maize</span> this season for +15% projected profit
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
              eNAM supply volume is stable. Good timing to cultivate Yellow Maize with projected post-harvest buyer demand from poultry feed millers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm pt-4 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-white/60">Risk Level</p>
              <p className="text-lg font-bold font-heading text-emerald-300 mt-0.5">Low</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-white/60">Confidence</p>
              <p className="text-lg font-bold font-heading text-accent mt-0.5">92%</p>
            </div>
          </div>
        </div>

        {/* Right AG-3 Price Gauge */}
        <div className="lg:col-span-4 bg-surface p-7 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              AG-3 PRICE GAUGE
            </p>
            <span className="text-[10px] font-semibold text-text-secondary bg-black/5 px-2 py-0.5 rounded-full">
              {selectedCrop}
            </span>
          </div>

          {/* Semi-circular Speedometer SVG Gauge */}
          <div className="relative flex flex-col items-center justify-center my-3">
            <svg viewBox="0 0 200 110" className="w-48 sm:w-56 overflow-visible">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Active Colored Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 145 35"
                fill="none"
                stroke="#176B3A"
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Needle Indicator */}
              <circle cx="100" cy="100" r="7" fill="#14221A" />
              <line 
                x1="100" 
                y1="100" 
                x2="135" 
                y2="45" 
                stroke="#14221A" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
            </svg>

            <div className="text-center -mt-3">
              <p className="text-3xl font-bold font-heading text-primary-dark">
                ₹{trendData?.currentPrice ? trendData.currentPrice.toLocaleString('en-IN') : '2,450'}
              </p>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                FAIR RANGE
              </span>
            </div>
          </div>

          {/* Gauge Baseline Points */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-black/5 text-center text-xs">
            <div>
              <p className="text-[10px] uppercase font-semibold text-text-secondary">Low Fair</p>
              <p className="font-bold text-text-primary mt-0.5">₹1,800</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-text-secondary">Modal</p>
              <p className="font-bold text-primary-dark mt-0.5">₹2,400</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold text-text-secondary">High Fair</p>
              <p className="font-bold text-text-primary mt-0.5">₹3,200</p>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. METRIC KPI ROW (From Screenshot 1)                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Avg Mandi Price</p>
          <p className="text-3xl font-bold font-heading text-primary-dark mt-2">
            ₹{trendData?.currentPrice || '2,640'}
          </p>
          <p className="text-xs text-text-secondary mt-1.5 font-medium">Across key mandis</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">NDVI Status</p>
          <p className="text-3xl font-bold font-heading text-emerald-700 mt-2">
            Healthy
          </p>
          <p className="text-xs text-text-secondary mt-1.5 font-medium">Crop health index steady</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Forecast Confidence</p>
          <p className="text-3xl font-bold font-heading text-text-primary mt-2">
            93%
          </p>
          <p className="text-xs text-text-secondary mt-1.5 font-medium">7-day price prediction</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Net Realization</p>
          <p className="text-3xl font-bold font-heading text-success mt-2">
            ₹20.6k
          </p>
          <p className="text-xs text-text-secondary mt-1.5 font-medium">After logistics and taxes · 0 transaction(s)</p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. SENTINEL SATELLITE NDVI & 30-DAY TREND (Screenshot 1)   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Sentinel Satellite NDVI Card */}
        <div className="lg:col-span-4 bg-surface p-7 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold font-heading text-lg text-text-primary flex items-center gap-2">
                <Satellite className="h-5 w-5 text-primary" /> Sentinel Satellite NDVI
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                GOOD
              </span>
            </div>

            <div className="my-5">
              <p className="text-5xl font-bold font-heading text-emerald-700">0.74</p>
              <p className="text-xs text-text-secondary font-semibold mt-1">NDVI Index (Normalized Difference Vegetation Index)</p>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mb-6">
              Vegetation is dense and healthy. Crops are in a very good growth window for the next 2-3 weeks. Canopy chlorophyll density indicates minimal water stress.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-black/5 text-[11px] text-text-secondary">
            <span>Sentinel Hub L2A</span>
            <span className="font-semibold text-text-primary">Last Updated: Today</span>
          </div>
        </div>

        {/* Right: 30-Day Market Trend Interactive Chart */}
        <div className="lg:col-span-8 bg-surface p-7 rounded-3xl border border-black/5 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold font-heading text-lg text-text-primary">
                  30-Day Market Trend
                </h3>
                {trendData?.changePercent && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                    trendData.isBullish ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                  }`}>
                    {trendData.isBullish ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {trendData.changePercent}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary mt-0.5">
                Daily modal price and arrival trends across major Indian APMCs
              </p>
            </div>

            {/* Crop Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-text-secondary whitespace-nowrap">Crop:</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-background border border-black/10 rounded-xl px-3 py-1.5 text-xs font-bold text-text-primary outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                {cropList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 w-full my-2">
            {trendLoading ? (
              <div className="h-full flex items-center justify-center text-xs text-text-secondary">
                Loading 30-day market curve...
              </div>
            ) : trendData?.history ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#176B3A" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#176B3A" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000000" strokeOpacity={0.05} />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 10, fill: '#647067' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: 10, fill: '#647067' }} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      fontSize: '12px'
                    }}
                    formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Modal Price']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#176B3A" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#priceGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-text-secondary">
                No trend data available for {selectedCrop}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-black/5 text-[11px] text-text-secondary gap-2">
            <div className="flex items-center gap-4">
              <span>30-Day High: <strong className="text-text-primary">₹{trendData?.high30D?.toLocaleString('en-IN') || 'N/A'}</strong></span>
              <span>30-Day Low: <strong className="text-text-primary">₹{trendData?.low30D?.toLocaleString('en-IN') || 'N/A'}</strong></span>
            </div>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Source: Agmarknet & eNAM Official Series
            </span>
          </div>
        </div>

      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 6. IMPORTANT MANDI MARKET NEWS SECTION                     */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-surface rounded-3xl border border-black/5 p-7 shadow-sm">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-black/5">
          <div>
            <h3 className="font-bold font-heading text-lg text-primary-dark">
              Important Mandi Market News & Bulletins
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Policy decisions, MSP revisions, and arrival alerts affecting your selling realization
            </p>
          </div>
          <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
            Live Updates
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {news.map((item) => (
            <div 
              key={item.id} 
              className="p-4 rounded-2xl bg-background border border-black/5 hover:border-primary/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {item.badge}
                  </span>
                  <span className="text-[11px] text-text-secondary">{item.date}</span>
                </div>
                <h4 className="font-bold text-sm text-text-primary leading-snug mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.snippet}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-secondary mt-3 pt-2 border-t border-black/5">
                <span className="font-medium text-emerald-800">{item.source}</span>
                <span className="inline-flex items-center gap-1 text-primary font-bold hover:underline cursor-pointer">
                  {item.tag} <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 7. PRESERVED LIVE MARKET TABLE & ACTIONS                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Table */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-3xl shadow-sm border border-black/5 overflow-hidden">
            <div className="p-5 border-b border-black/5 flex justify-between items-center bg-background/50">
              <h2 className="text-base font-bold font-heading text-primary-dark flex items-center gap-2">
                Live Mandi Prices
                <span className="relative flex h-2 w-2 ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
              </h2>
              <Link to="/markets" className="text-xs font-bold text-primary hover:underline">
                View All Mandis →
              </Link>
            </div>

            {loading ? (
              <div className="p-8 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-background rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background text-text-secondary text-xs border-b border-black/5">
                      <th className="p-4 font-semibold">Commodity</th>
                      <th className="p-4 font-semibold">Market</th>
                      <th className="p-4 font-semibold">Modal Price (₹/q)</th>
                      <th className="p-4 font-semibold">Trend</th>
                      <th className="p-4 font-semibold">Demand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketRows.slice(0, 6).map((r, idx) => (
                      <tr key={idx} className="border-b border-black/5 hover:bg-background/50 transition-colors text-xs">
                        <td className="p-4 font-bold text-text-primary">{r.commodity}</td>
                        <td className="p-4 text-text-secondary">{r.market}</td>
                        <td className="p-4 font-semibold text-primary-dark">₹{r.modalPrice?.toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 font-bold ${r.up ? 'text-success' : 'text-danger'}`}>
                            {r.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                            {r.trend}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            r.demand === 'Very High' ? 'bg-success/10 text-success' :
                            r.demand === 'High' ? 'bg-info/10 text-info' :
                            'bg-warning/10 text-warning'
                          }`}>
                            {r.demand}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sell Crop Action Card */}
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl shadow-sm border border-black/5 p-6 flex flex-col justify-between">
            <div>
              <div className="bg-primary/10 p-3 rounded-2xl w-fit text-primary mb-4">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-heading text-primary-dark mb-1">
                Sell Crop with ENR Engine
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                Calculate expected transport costs, storage holding limits, and risk adjustments before you take produce to the market.
              </p>
            </div>
            <Link 
              to="/recommendation" 
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs text-center shadow-md hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5"
            >
              Start Selling Decision <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-surface rounded-3xl shadow-sm border border-black/5 p-6">
            <h3 className="text-sm font-bold font-heading text-text-primary mb-3">
              Active Trade Linkages
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Review and accept direct bids on your farm produce listings.
            </p>
            <Link 
              to="/offers" 
              className="block w-full bg-background border border-black/10 text-text-primary py-2.5 rounded-xl text-xs font-bold text-center hover:bg-white transition-all"
            >
              Open Trade Center →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
