import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ArrowRight, Calculator, CheckCircle, AlertTriangle, Info, TrendingUp, MapPin, ShieldCheck, Leaf, Loader2 } from 'lucide-react';

export default function Recommendation() {
  const [commodities, setCommodities] = useState([]);
  const [formData, setFormData] = useState({
    commodityName: 'Soybean',
    quantity: 20,
    maxDistance: 300,
    urgencyDays: 7,
    storageAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/commodities')
      .then(res => setCommodities(res.data))
      .catch(() => setCommodities([
        { name: 'Soybean' }, { name: 'Wheat' }, { name: 'Onion' },
        { name: 'Cotton' }, { name: 'Maize' }, { name: 'Rice (Paddy)' }
      ]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/recommendations', formData);
      setResult(res.data);
    } catch (err) {
      setError('Could not fetch recommendations. Please check your inputs and try again.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const fmt = (n) => typeof n === 'number' ? '₹' + n.toLocaleString('en-IN') : 'N/A';

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-primary-dark tracking-tight flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary"><Calculator className="h-7 w-7" /></div>
          Market Intelligence Engine
        </h1>
        <p className="text-text-secondary mt-2">Calculate your true Expected Net Realisation and find the best selling option.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4"
        >
          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-black/5 sticky top-8">
            <h2 className="text-xl font-bold font-heading text-text-primary mb-6">Your Produce Details</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Crop / Commodity</label>
                <select
                  name="commodityName"
                  value={formData.commodityName}
                  onChange={handleChange}
                  className="w-full bg-background border-black/10 rounded-xl p-3.5 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                >
                  {commodities.map((c, i) => (
                    <option key={i} value={c.name}>{c.name}{c.category ? ` (${c.category})` : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Quantity (Quintals)</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" className="w-full bg-background border-black/10 rounded-xl p-3.5 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Max Transport Distance (km)</label>
                <input type="number" name="maxDistance" value={formData.maxDistance} onChange={handleChange} min="10" className="w-full bg-background border-black/10 rounded-xl p-3.5 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Selling Deadline (Days)</label>
                <input type="number" name="urgencyDays" value={formData.urgencyDays} onChange={handleChange} min="1" className="w-full bg-background border-black/10 rounded-xl p-3.5 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>

              <label className="flex items-center gap-3 cursor-pointer py-2">
                <input type="checkbox" name="storageAvailable" checked={formData.storageAvailable} onChange={handleChange} className="h-5 w-5 text-primary rounded border-black/20 focus:ring-primary/30" />
                <span className="text-sm font-medium text-text-primary">I have storage available</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all font-semibold text-lg flex justify-center items-center gap-2 disabled:opacity-60"
              >
                {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing...</> : <>Analyze Markets <ArrowRight className="h-5 w-5" /></>}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Results */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 bg-danger/10 border border-danger/20 rounded-2xl text-danger font-medium">
                {error}
              </motion.div>
            )}

            {!result && !error && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-[400px] flex flex-col items-center justify-center bg-surface border-2 border-dashed border-black/10 rounded-2xl p-12 text-center">
                <div className="bg-primary/10 p-4 rounded-2xl mb-6"><Leaf className="h-10 w-10 text-primary" /></div>
                <p className="text-text-secondary text-lg max-w-md">Enter your produce details to receive a personalized market recommendation based on Expected Net Realisation.</p>
              </motion.div>
            )}

            {result && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Sell Now vs Wait */}
                <div className={`p-5 rounded-2xl border flex gap-4 items-start ${result.trend?.indicator === 'SELL NOW' ? 'bg-warning/10 border-warning/20' : 'bg-info/5 border-info/10'}`}>
                  {result.trend?.indicator === 'SELL NOW'
                    ? <AlertTriangle className="text-warning h-7 w-7 flex-shrink-0 mt-0.5" />
                    : <Info className="text-info h-7 w-7 flex-shrink-0 mt-0.5" />
                  }
                  <div>
                    <h3 className={`font-bold text-lg font-heading ${result.trend?.indicator === 'SELL NOW' ? 'text-warning' : 'text-info'}`}>
                      Timing: {result.trend?.indicator} <span className="text-sm font-normal">({result.trend?.confidence} confidence)</span>
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">{result.trend?.reason}</p>
                  </div>
                </div>

                {/* Top Recommendation */}
                {result.recommendations?.length > 0 && (
                  <div className="bg-surface rounded-2xl overflow-hidden shadow-lg border-2 border-primary/60">
                    <div className="bg-primary p-5">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
                        <CheckCircle className="h-6 w-6" /> Recommended Selling Option
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold font-heading text-text-primary">{result.recommendations[0].name}</h3>
                          <div className="flex items-center gap-3 mt-2 text-sm text-text-secondary">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${result.recommendations[0].type === 'MARKET' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'}`}>
                              {result.recommendations[0].type === 'MARKET' ? <><MapPin className="h-3 w-3 inline mr-1" />Market</> : <><ShieldCheck className="h-3 w-3 inline mr-1" />Buyer</>}
                            </span>
                            {result.recommendations[0].distance && <span>{result.recommendations[0].distance} km away</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-secondary uppercase font-semibold tracking-wider">Expected Net Realisation</p>
                          <p className="text-3xl font-bold font-heading text-success">{fmt(result.recommendations[0].enrBreakdown?.expectedNetRealisation)}</p>
                        </div>
                      </div>

                      {/* Explanation */}
                      <div className="bg-success/5 p-5 rounded-xl border border-success/10">
                        <p className="font-bold text-primary-dark mb-2 font-heading">Why this option?</p>
                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                          {result.recommendations[0].explanation?.map((exp, i) => <li key={i}>{exp}</li>)}
                          <li>Highest Expected Net Realisation for your specific constraints.</li>
                        </ul>
                      </div>

                      {/* ENR Breakdown */}
                      <div>
                        <h4 className="font-bold text-text-primary mb-3 font-heading border-b border-black/5 pb-2">ENR Calculation Breakdown</h4>
                        <table className="w-full text-sm">
                          <tbody>
                            {[
                              { label: `Expected Selling Price (${formData.quantity}q)`, value: result.recommendations[0].enrBreakdown?.expectedSellingPrice, neg: false },
                              { label: 'Estimated Transport Cost', value: result.recommendations[0].enrBreakdown?.transportCost, neg: true },
                              { label: 'Estimated Storage Cost', value: result.recommendations[0].enrBreakdown?.storageCost, neg: true },
                              { label: 'Transaction / Platform Fees', value: result.recommendations[0].enrBreakdown?.transactionCost, neg: true },
                              { label: 'Expected Quantity/Quality Loss', value: result.recommendations[0].enrBreakdown?.expectedLoss, neg: true },
                            ].map((row, i) => (
                              <tr key={i} className="border-b border-black/5">
                                <td className={`py-3 ${row.neg ? 'text-danger' : 'text-text-primary'}`}>{row.neg ? '−' : ''} {row.label}</td>
                                <td className={`py-3 text-right font-medium ${row.neg ? 'text-danger' : ''}`}>{row.neg ? '− ' : ''}{fmt(row.value)}</td>
                              </tr>
                            ))}
                            {result.recommendations[0].enrBreakdown?.riskAdjustment > 0 && (
                              <tr className="border-b border-black/5">
                                <td className="py-3 text-warning">− Unverified Buyer Risk Penalty</td>
                                <td className="py-3 text-right font-medium text-warning">− {fmt(result.recommendations[0].enrBreakdown.riskAdjustment)}</td>
                              </tr>
                            )}
                            <tr className="bg-success/5 font-bold text-text-primary">
                              <td className="py-4 px-3 rounded-l-xl">Expected Net Realisation</td>
                              <td className="py-4 px-3 text-right text-xl text-success rounded-r-xl">{fmt(result.recommendations[0].enrBreakdown?.expectedNetRealisation)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alternatives */}
                {result.recommendations?.length > 1 && (
                  <div>
                    <h3 className="text-lg font-bold font-heading text-text-primary mb-4">Alternative Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.recommendations.slice(1, 4).map((alt, idx) => (
                        <div key={idx} className="bg-surface p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-text-primary">{alt.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${alt.type === 'MARKET' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'}`}>
                              {alt.type}
                            </span>
                          </div>
                          <p className="text-xl font-bold font-heading text-primary-dark">{fmt(alt.enrBreakdown?.expectedNetRealisation)}</p>
                          <p className="text-xs text-text-secondary mt-1">{alt.distance ? `${alt.distance} km away` : 'Local buyer'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
