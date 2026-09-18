import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  Package, 
  Truck, 
  Warehouse, 
  CheckCircle2, 
  Calendar,
  Building,
  Award,
  CircleDollarSign,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      axios.get(`/api/profile/${user.id}`)
        .then(res => {
          setProfileData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-44 bg-surface rounded-3xl border border-black/5 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface rounded-2xl border border-black/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const role = user?.role || 'farmer';
  const isFarmer = role === 'farmer';
  const isBuyer = role === 'buyer';
  const isAdmin = role === 'admin';

  const farmer = user?.farmerProfile || profileData?.user?.farmerProfile;
  const buyer = user?.buyerProfile || profileData?.user?.buyerProfile;
  const admin = user?.adminProfile || profileData?.user?.adminProfile;
  const stats = profileData?.stats || {};

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-3xl border border-black/5 p-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-primary-dark text-white flex items-center justify-center font-heading font-bold text-3xl shadow-xl shadow-primary/20">
              {(farmer?.name || buyer?.name || admin?.name || user?.phone || 'U')[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-primary-dark">
                  {farmer?.name || buyer?.companyName || buyer?.name || admin?.name || 'User Profile'}
                </h1>
                
                {isBuyer && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    buyer?.verificationStatus === 'VERIFIED'
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-warning/10 text-warning border border-warning/20'
                  }`}>
                    {buyer?.verificationStatus === 'VERIFIED' ? (
                      <><ShieldCheck className="h-3.5 w-3.5" /> Verified Buyer</>
                    ) : (
                      <><AlertCircle className="h-3.5 w-3.5" /> KYC Pending</>
                    )}
                  </span>
                )}

                {isFarmer && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Verified Farmer (Seller)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-text-secondary mt-2">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-primary" /> +91 {user?.phone}
                </span>
                {user?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-primary" /> {user?.email}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" /> {farmer?.location || 'Nashik District, Maharashtra'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-background border border-black/5 rounded-2xl px-5 py-3 text-right">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">Portal Access</p>
              <p className="font-bold text-sm text-primary capitalize font-heading">
                {role} {isFarmer && '· Seller View'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SELLER / FARMER STATS & OVERVIEW */}
      {/* ────────────────────────────────────────────────────────── */}
      {isFarmer && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">Total Produce Sold</span>
                <div className="bg-info/10 text-info p-2 rounded-xl">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading text-text-primary">
                {stats.totalQuantityQuintals || 115} <span className="text-xs font-normal text-text-secondary">Quintals</span>
              </p>
              <p className="text-xs text-text-secondary mt-2 font-medium">Across 3 harvest seasons</p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">Total Revenue Realized</span>
                <div className="bg-success/10 text-success p-2 rounded-xl">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading text-success">
                ₹{(stats.totalRevenueINR || 345000).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-success mt-2 font-medium flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +14% vs local mandi spot rate
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">Average Net Realization</span>
                <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading text-primary-dark">
                ₹{(stats.avgSellingPrice || 4420).toLocaleString('en-IN')} <span className="text-xs font-normal text-text-secondary">/q</span>
              </p>
              <p className="text-xs text-text-secondary mt-2 font-medium">After transportation & storage</p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">Active Listings</span>
                <div className="bg-warning/10 text-warning p-2 rounded-xl">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading text-text-primary">
                {stats.activeListings ?? 3} <span className="text-xs font-normal text-text-secondary">Live</span>
              </p>
              <p className="text-xs text-warning mt-2 font-medium">7 incoming bids waiting</p>
            </div>
          </div>

          {/* Infrastructure & Storage Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Storage Meter */}
            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                  <Warehouse className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold font-heading text-text-primary">On-Farm Storage Capacity</h3>
                  <p className="text-xs text-text-secondary">Enables timing optimization for higher ENR</p>
                </div>
              </div>

              <div className="bg-background rounded-xl p-4 border border-black/5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-text-primary">Current Utilization</span>
                  <span className="font-bold text-primary">25 / 50 Quintals (50%)</span>
                </div>
                <div className="w-full bg-black/10 rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: '50%' }} />
                </div>
                <p className="text-[11px] text-text-secondary mt-2">
                  Can store produce for up to 35 days without significant moisture degradation.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-success/5 border border-success/10 text-xs">
                <span className="font-semibold text-text-primary flex items-center gap-2">
                  <Truck className="h-4 w-4 text-success" /> Transport Linkage
                </span>
                <span className="text-success font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Active & Verified
                </span>
              </div>
            </div>

            {/* Produce & Crop History Table */}
            <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <h3 className="font-bold font-heading text-text-primary mb-4 flex items-center justify-between">
                <span>My Harvest Portfolio & Active Produce</span>
                <span className="text-xs font-normal text-text-secondary">3 Active Commodities</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-background text-text-secondary text-xs border-b border-black/5">
                      <th className="p-3 font-semibold">Commodity</th>
                      <th className="p-3 font-semibold">Quantity</th>
                      <th className="p-3 font-semibold">Expected Price</th>
                      <th className="p-3 font-semibold">Bids Received</th>
                      <th className="p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { crop: 'Soybean', qty: '25 q', price: '₹4,600 /q', bids: '3 offers', status: 'ACTIVE', badge: 'bg-info/10 text-info' },
                      { crop: 'Wheat', qty: '50 q', price: '₹2,400 /q', bids: '2 offers', status: 'ACTIVE', badge: 'bg-info/10 text-info' },
                      { crop: 'Onion', qty: '40 q', price: '₹2,200 /q', bids: '2 offers', status: 'ACTIVE', badge: 'bg-info/10 text-info' }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-black/5 hover:bg-background/40">
                        <td className="p-3 font-bold text-text-primary">{row.crop}</td>
                        <td className="p-3 text-text-secondary">{row.qty}</td>
                        <td className="p-3 font-semibold text-primary-dark">{row.price}</td>
                        <td className="p-3 font-medium text-text-primary">{row.bids}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.badge}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* BUYER STATS & OVERVIEW */}
      {/* ────────────────────────────────────────────────────────── */}
      {isBuyer && (
        <>
          {/* Buyer Trust & Reliability KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">Reliability Rating</span>
                <div className="bg-success/10 text-success p-2 rounded-xl">
                  <Award className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold font-heading text-success">
                  {buyer?.reliabilityScore || 94.5}
                </p>
                <span className="text-xs font-medium text-text-secondary">/ 100</span>
              </div>
              <div className="w-full bg-black/5 rounded-full h-2 mt-3 overflow-hidden">
                <div 
                  className="bg-success h-2 rounded-full" 
                  style={{ width: `${buyer?.reliabilityScore || 94.5}%` }} 
                />
              </div>
              <p className="text-[11px] text-text-secondary mt-2">Grade: Tier-1 Verified Procurer</p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">Completed Deals</span>
                <div className="bg-primary/10 text-primary p-2 rounded-xl">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold font-heading text-primary-dark">
                {buyer?.completedTransactions || 245}
              </p>
              <p className="text-xs text-text-secondary mt-2 font-medium">100% on-time direct payment</p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">Procurement Volume</span>
                <div className="bg-info/10 text-info p-2 rounded-xl">
                  <Package className="h-5 w-5" />
                </div>
              </div>
              <p className="text-3xl font-bold font-heading text-text-primary">
                4,820 <span className="text-xs font-normal text-text-secondary">q</span>
              </p>
              <p className="text-xs text-text-secondary mt-2 font-medium">Soybean, Wheat, Pulses</p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary">Total Disbursed</span>
                <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-bold font-heading text-emerald-800">
                ₹2.18 Cr
              </p>
              <p className="text-xs text-text-secondary mt-2 font-medium">Direct to farmer bank accounts</p>
            </div>
          </div>

          {/* Company Profile Details */}
          <div className="bg-surface p-8 rounded-3xl border border-black/5 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-heading text-text-primary flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" /> Corporate & Licensing Verification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-4 rounded-2xl border border-black/5">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Company Entity</p>
                <p className="font-bold text-text-primary">{buyer?.companyName || 'Agrawal Agro Processors Pvt Ltd'}</p>
                <p className="text-xs text-text-secondary mt-1">CIN: U01111MH2019PTC324511</p>
              </div>

              <div className="bg-background p-4 rounded-2xl border border-black/5">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">APMC License</p>
                <p className="font-bold text-text-primary">MH-NSK-TRD-4920</p>
                <p className="text-xs text-success font-semibold mt-1">Valid through Dec 2028</p>
              </div>

              <div className="bg-background p-4 rounded-2xl border border-black/5">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Mandate & Reach</p>
                <p className="font-bold text-text-primary">Multi-Mandi Buyer</p>
                <p className="text-xs text-text-secondary mt-1">Maharashtra, MP, Gujarat</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
