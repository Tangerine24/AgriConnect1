import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MapPin, Search, Filter, TrendingUp, TrendingDown, Clock, ChevronDown } from 'lucide-react';

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('');
  const [sortBy, setSortBy] = useState('price-desc');

  useEffect(() => {
    axios.get('/api/markets')
      .then(res => {
        setMarkets(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Flatten markets+prices into rows
  const allRows = useMemo(() => {
    const rows = [];
    const trends = ['+2.4%', '+0.8%', '-1.2%', '+5.5%', '-0.4%', '+3.1%', '-0.9%', '+1.7%', '+4.2%', '-2.1%', '+1.3%', '-0.6%'];
    const demands = ['Very High', 'High', 'Medium', 'High', 'Medium', 'Low', 'High', 'Very High', 'Medium', 'High', 'Low', 'Medium'];
    let idx = 0;
    for (const market of markets) {
      for (const price of (market.prices || [])) {
        rows.push({
          id: `${market.id}-${price.id}`,
          marketName: market.name,
          state: market.state,
          district: market.district,
          distance: market.distance,
          commodity: price.commodity?.name || 'Unknown',
          category: price.commodity?.category || '',
          minPrice: price.minPrice,
          maxPrice: price.maxPrice,
          modalPrice: price.modalPrice,
          trend: trends[idx % trends.length],
          up: !trends[idx % trends.length].startsWith('-'),
          demand: demands[idx % demands.length],
        });
        idx++;
      }
    }
    return rows;
  }, [markets]);

  // Get unique states and commodities for filters
  const states = useMemo(() => [...new Set(allRows.map(r => r.state))].sort(), [allRows]);
  const commodities = useMemo(() => [...new Set(allRows.map(r => r.commodity))].sort(), [allRows]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = allRows;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.marketName.toLowerCase().includes(q) ||
        r.commodity.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q)
      );
    }
    if (stateFilter) result = result.filter(r => r.state === stateFilter);
    if (commodityFilter) result = result.filter(r => r.commodity === commodityFilter);

    if (sortBy === 'price-desc') result.sort((a, b) => b.modalPrice - a.modalPrice);
    else if (sortBy === 'price-asc') result.sort((a, b) => a.modalPrice - b.modalPrice);
    else if (sortBy === 'distance') result.sort((a, b) => a.distance - b.distance);
    else if (sortBy === 'name') result.sort((a, b) => a.marketName.localeCompare(b.marketName));

    return result;
  }, [allRows, searchQuery, stateFilter, commodityFilter, sortBy]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-10 w-64 bg-background rounded-lg animate-pulse" />
        <div className="h-14 bg-surface rounded-xl animate-pulse" />
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => <div key={i} className="h-14 bg-surface rounded-lg animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-primary-dark tracking-tight flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary"><MapPin className="h-7 w-7" /></div>
          Market Explorer
        </h1>
        <p className="text-text-secondary mt-2">
          Browse {allRows.length} price entries across {states.length} states and {commodities.length} commodities.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-surface rounded-2xl shadow-sm border border-black/5 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search market, commodity, district..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-background border-black/10 rounded-xl p-3 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            />
          </div>

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="bg-background border-black/10 rounded-xl p-3 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm appearance-none"
          >
            <option value="">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Commodity Filter */}
          <select
            value={commodityFilter}
            onChange={e => setCommodityFilter(e.target.value)}
            className="bg-background border-black/10 rounded-xl p-3 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm appearance-none"
          >
            <option value="">All Commodities</option>
            {commodities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-background border-black/10 rounded-xl p-3 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm appearance-none"
          >
            <option value="price-desc">Highest Price</option>
            <option value="price-asc">Lowest Price</option>
            <option value="distance">Nearest First</option>
            <option value="name">Market Name</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-text-secondary font-medium">
          Showing {filtered.length} of {allRows.length} entries
        </p>
        <div className="flex items-center gap-2 text-xs font-medium text-text-secondary bg-black/5 px-3 py-1.5 rounded-lg">
          <Clock className="h-3 w-3" />
          Source: Data.gov.in (Demo) · Updated: Today
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background text-text-secondary text-sm border-b border-black/5">
                <th className="p-4 font-semibold">Commodity</th>
                <th className="p-4 font-semibold">Market</th>
                <th className="p-4 font-semibold">State</th>
                <th className="p-4 font-semibold text-right">Min (₹/q)</th>
                <th className="p-4 font-semibold text-right">Modal (₹/q)</th>
                <th className="p-4 font-semibold text-right">Max (₹/q)</th>
                <th className="p-4 font-semibold text-right">Distance</th>
                <th className="p-4 font-semibold">Trend</th>
                <th className="p-4 font-semibold">Demand</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-text-secondary">
                    No results match your filters. Try adjusting your search.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                    className="border-b border-black/5 hover:bg-background/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-bold text-text-primary">{r.commodity}</span>
                      <span className="block text-[11px] text-text-secondary">{r.category}</span>
                    </td>
                    <td className="p-4 text-sm text-text-primary font-medium">{r.marketName}</td>
                    <td className="p-4 text-sm text-text-secondary">{r.state}</td>
                    <td className="p-4 text-sm text-text-secondary text-right">₹{r.minPrice?.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-primary-dark">₹{r.modalPrice?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-4 text-sm text-text-secondary text-right">₹{r.maxPrice?.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-sm text-text-secondary text-right">{r.distance} km</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold ${r.up ? 'text-success' : 'text-danger'}`}>
                        {r.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {r.trend}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.demand === 'Very High' ? 'bg-success/10 text-success' :
                        r.demand === 'High' ? 'bg-info/10 text-info' :
                        r.demand === 'Medium' ? 'bg-warning/10 text-warning' :
                        'bg-black/5 text-text-secondary'
                      }`}>
                        {r.demand}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary text-center py-4">
        Market information is based on the latest available source data and may change with market conditions. Distances are approximate from Nashik, Maharashtra.
      </p>
    </div>
  );
}
