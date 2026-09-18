import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  ShieldAlert, 
  Users, 
  Store, 
  PackageCheck, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  AlertCircle,
  Database,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAdminData = async () => {
    try {
      const [statsRes, buyersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats'),
        axios.get('http://localhost:5000/api/admin/buyers')
      ]);
      setStats(statsRes.data);
      setBuyers(buyersRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleVerification = async (buyerId, currentStatus) => {
    const newStatus = currentStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    setUpdatingId(buyerId);
    try {
      await axios.post('http://localhost:5000/api/admin/verify-buyer', {
        buyerId,
        status: newStatus
      });
      // Refresh
      await fetchAdminData();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update buyer status');
    }
    setUpdatingId(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-28 bg-surface rounded-3xl border border-black/5 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-surface rounded-2xl border border-black/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" /> APMC Operations Console
            </span>
            <span className="text-xs text-text-secondary flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-success" /> Live Feed Active
            </span>
          </div>
          <h1 className="text-3xl font-bold font-heading text-primary-dark tracking-tight">
            Central Administration Portal
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            System-wide oversight for farmer price realization, buyer verification queue, and APMC market linkages.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-black/10 hover:bg-background text-text-primary text-xs font-bold transition-all shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Sync Data
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">Registered Farmers</span>
            <div className="bg-primary/10 text-primary p-2 rounded-xl">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-primary-dark">{stats?.farmersCount || 1}</p>
          <p className="text-xs text-text-secondary mt-2">Active in Nashik region</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">Registered Buyers</span>
            <div className="bg-info/10 text-info p-2 rounded-xl">
              <Store className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold font-heading text-text-primary">{stats?.buyersCount || 6}</p>
            <span className="text-xs font-bold text-success">({stats?.verifiedBuyers || 4} Verified)</span>
          </div>
          <p className="text-xs text-warning mt-2 font-medium">{stats?.unverifiedBuyers || 2} Pending KYC review</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">Tracked APMC Markets</span>
            <div className="bg-success/10 text-success p-2 rounded-xl">
              <Database className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold font-heading text-success">{stats?.marketsCount || 22}</p>
          <p className="text-xs text-text-secondary mt-2 font-medium">10 Indian States</p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-secondary">Active Produce Listings</span>
            <div className="bg-warning/10 text-warning p-2 rounded-xl">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold font-heading text-text-primary">{stats?.listingsCount || 3}</p>
            <span className="text-xs font-normal text-text-secondary">({stats?.offersCount || 7} bids)</span>
          </div>
          <p className="text-xs text-text-secondary mt-2 font-medium">Soybean, Wheat, Onion</p>
        </div>
      </div>

      {/* Buyer Verification & KYC Queue */}
      <div className="bg-surface rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-background/40">
          <div>
            <h2 className="text-lg font-bold font-heading text-primary-dark flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Buyer Verification & Compliance Queue
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Review and authorize buyer profiles to protect farmers from payment defaults and speculative risks.
            </p>
          </div>
          <span className="text-xs font-bold bg-black/5 text-text-secondary px-3 py-1 rounded-full self-start">
            {buyers.length} Total Buyers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-background text-text-secondary text-xs border-b border-black/5">
                <th className="p-4 font-semibold">Entity / Trader</th>
                <th className="p-4 font-semibold">Contact & Phone</th>
                <th className="p-4 font-semibold">Reliability Score</th>
                <th className="p-4 font-semibold">Completed Deals</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => (
                <tr key={b.id} className="border-b border-black/5 hover:bg-background/40 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-text-primary">{b.companyName || b.name}</p>
                    <p className="text-xs text-text-secondary">{b.name}</p>
                  </td>
                  <td className="p-4 text-xs font-medium text-text-primary">
                    <p>+91 {b.user?.phone}</p>
                    <p className="text-text-secondary">{b.user?.email || 'No email provided'}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs">{b.reliabilityScore}/100</span>
                      <div className="w-16 bg-black/10 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${
                            b.reliabilityScore >= 80 ? 'bg-success' : b.reliabilityScore >= 50 ? 'bg-warning' : 'bg-danger'
                          }`}
                          style={{ width: `${b.reliabilityScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-text-primary">
                    {b.completedTransactions} trades
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      b.verificationStatus === 'VERIFIED'
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-warning/10 text-warning border border-warning/20'
                    }`}>
                      {b.verificationStatus === 'VERIFIED' ? (
                        <><CheckCircle2 className="h-3 w-3" /> VERIFIED</>
                      ) : (
                        <><AlertCircle className="h-3 w-3" /> UNVERIFIED</>
                      )}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleVerification(b.id, b.verificationStatus)}
                      disabled={updatingId === b.id}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        b.verificationStatus === 'VERIFIED'
                          ? 'bg-danger/10 text-danger hover:bg-danger/20'
                          : 'bg-primary text-white hover:bg-primary-dark shadow-sm'
                      }`}
                    >
                      {updatingId === b.id 
                        ? 'Updating...' 
                        : b.verificationStatus === 'VERIFIED' 
                          ? 'Revoke Status' 
                          : 'Approve & Verify'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
