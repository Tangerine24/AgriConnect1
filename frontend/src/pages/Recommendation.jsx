import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Calculator, CheckCircle, AlertTriangle, Info, TrendingUp, MapPin, ShieldCheck, Leaf, Loader2, RotateCcw, ChevronDown } from 'lucide-react';

export default function Recommendation() {
  const [commodities, setCommodities] = useState([]);
  const [formData, setFormData] = useState({
    commodityName: '',
    quantity: '',
    maxDistance: '',
    urgencyDays: '',
    storageAvailable: null
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/commodities')
      .then(res => setCommodities(res.data))
      .catch(() => setCommodities([
        { name: 'Soybean' }, { name: 'Wheat' }, { name: 'Onion' },
        { name: 'Cotton' }, { name: 'Maize' }, { name: 'Rice (Paddy)' },
        { name: 'Yellow Maize' }, { name: 'Tomato' }, { name: 'Potato' },
        { name: 'Chickpea (Chana)' }, { name: 'Mustard' }, { name: 'Groundnut' },
        { name: 'Tur (Pigeon Pea)' }
      ]));
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.commodityName) return alert('Please select a crop.');
    if (!formData.quantity || Number(formData.quantity) <= 0) return alert('Please enter a valid quantity.');
    if (!formData.maxDistance || Number(formData.maxDistance) <= 0) return alert('Please select or enter max distance.');
    if (!formData.urgencyDays || Number(formData.urgencyDays) <= 0) return alert('Please select a selling deadline.');
    if (formData.storageAvailable === null) return alert('Please select whether you have storage available.');

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/recommendations', {
        ...formData,
        quantity: Number(formData.quantity),
        maxDistance: Number(formData.maxDistance),
        urgencyDays: Number(formData.urgencyDays),
      });
      setResult(res.data);
    } catch (err) {
      setError('Could not fetch recommendations. Please check your inputs and try again.');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFormData({ commodityName: '', quantity: '', maxDistance: '', urgencyDays: '', storageAvailable: null });
    setResult(null);
    setError(null);
  };

  const fmt = (n) => typeof n === 'number' ? '₹' + n.toLocaleString('en-IN') : 'N/A';

  const quantityPresets = [25, 50, 100, 200];
  const distancePresets = [
    { label: 'Near (≤50 km)', value: 50 },
    { label: 'Regional (≤150 km)', value: 150 },
    { label: 'State (≤300 km)', value: 300 },
    { label: 'National (≤600 km)', value: 600 },
  ];
  const urgencyPresets = [
    { label: 'Urgent — 3 days', value: 3 },
    { label: 'This week — 7 days', value: 7 },
    { label: 'Fortnight — 14 days', value: 14 },
    { label: 'Next month — 30 days', value: 30 },
  ];

  const isFormComplete =
    formData.commodityName &&
    Number(formData.quantity) > 0 &&
    Number(formData.maxDistance) > 0 &&
    Number(formData.urgencyDays) > 0 &&
    formData.storageAvailable !== null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary-dark tracking-tight flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary"><Calculator className="h-7 w-7" /></div>
            Sell Crop — ENR Engine
          </h1>
          <p className="text-text-secondary mt-2 text-sm ml-14">Fill in your crop details to find the best market or buyer with the highest Expected Net Realisation.</p>
        </div>
        {(result || error) && (
          <button onClick={handleReset} className="flex items-center gap-2 text-xs font-bold text-text-secondary bg-surface border border-black/10 px-4 py-2 rounded-xl hover:bg-background transition-all flex-shrink-0">
            <RotateCcw className="h-3.5 w-3.5" /> Start Over
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ─── FORM ─── */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4">
          <div className="bg-surface p-7 rounded-2xl shadow-sm border border-black/5 sticky top-8">
            <h2 className="text-lg font-bold font-heading text-text-primary mb-6 pb-3 border-b border-black/5">Your Produce Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. CROP */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Select Crop <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.commodityName}
                    onChange={(e) => handleChange('commodityName', e.target.value)}
                    className={`w-full bg-background rounded-xl p-3.5 pr-10 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none font-medium text-sm ${
                      formData.commodityName ? 'border-primary/40 text-text-primary' : 'border-black/10 text-text-secondary'
                    }`}
                  >
                    <option value="" disabled>— Choose a crop —</option>
                    {commodities.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}{c.category ? ` (${c.category})` : ''}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
                </div>
                {formData.commodityName && (
                  <p className="text-[11px] text-primary font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> {formData.commodityName} selected
                  </p>
                )}
              </div>

              {/* 2. QUANTITY */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Quantity (Quintals) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {quantityPresets.map((q) => (
                    <button key={q} type="button" onClick={() => handleChange('quantity', q)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        Number(formData.quantity) === q
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-background border-black/10 text-text-secondary hover:border-primary/40 hover:text-primary'
                      }`}>
                      {q}q
                    </button>
                  ))}
                </div>
                <input
                  type="number" placeholder="Or type custom amount..."
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  min="1"
                  className="w-full bg-background border-black/10 rounded-xl p-3 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              {/* 3. DISTANCE */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Max Transport Distance <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  {distancePresets.map((d) => (
                    <button key={d.value} type="button" onClick={() => handleChange('maxDistance', d.value)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-left leading-tight ${
                        Number(formData.maxDistance) === d.value
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-background border-black/10 text-text-secondary hover:border-primary/40 hover:text-primary'
                      }`}>
                      {d.label}
                    </button>
                  ))}
                </div>
                <input
                  type="number" placeholder="Or enter exact km..."
                  value={formData.maxDistance}
                  onChange={(e) => handleChange('maxDistance', e.target.value)}
                  min="10"
                  className="w-full bg-background border-black/10 rounded-xl p-3 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>

              {/* 4. URGENCY */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Selling Deadline <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {urgencyPresets.map((u) => (
                    <button key={u.value} type="button" onClick={() => handleChange('urgencyDays', u.value)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-left leading-tight ${
                        Number(formData.urgencyDays) === u.value
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-background border-black/10 text-text-secondary hover:border-primary/40 hover:text-primary'
                      }`}>
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. STORAGE */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  On-Farm Storage Available? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => handleChange('storageAvailable', true)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      formData.storageAvailable === true
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-background border-black/10 text-text-secondary hover:border-emerald-400'
                    }`}>
                    ✓ Yes, I do
                  </button>
                  <button type="button" onClick={() => handleChange('storageAvailable', false)}
                    className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                      formData.storageAvailable === false
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : 'bg-background border-black/10 text-text-secondary hover:border-red-400'
                    }`}>
                    ✗ No storage
                  </button>
                </div>
                {formData.storageAvailable !== null && (
                  <p className="text-[11px] text-text-secondary mt-1.5">
                    {formData.storageAvailable
                      ? 'Storage enables holding — you can wait for a better price swing.'
                      : 'No storage means faster sale options are prioritised.'}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading || !isFormComplete}
                className="w-full bg-primary text-white py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold text-base flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading
                  ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing Markets...</>
                  : <><TrendingUp className="h-5 w-5" /> Find Best Option</>
                }
              </button>
              {!isFormComplete && !loading && (
                <p className="text-center text-[11px] text-text-secondary -mt-2">Fill all fields above to enable</p>
              )}

            </form>
          </div>
        </motion.div>

        {/* ─── RESULTS ─── */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">

            {error && (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-medium">
                {error}
              </motion.div>
            )}

            {!result && !error && !loading && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[520px] flex flex-col items-center justify-center bg-surface border-2 border-dashed border-black/10 rounded-2xl p-12 text-center">
                <div className="bg-primary/10 p-5 rounded-2xl mb-5"><Leaf className="h-12 w-12 text-primary" /></div>
                <h3 className="text-lg font-bold font-heading text-text-primary mb-2">Ready to find your best selling option</h3>
                <p className="text-text-secondary text-sm max-w-sm">
                  Select your crop, quantity, max travel distance, selling deadline, and storage — then click <strong>Find Best Option</strong>.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 text-xs text-text-secondary w-full max-w-sm">
                  {[{ icon: '🌾', label: 'Choose crop' }, { icon: '📦', label: 'Set quantity' }, { icon: '📍', label: 'Set distance' }].map(s => (
                    <div key={s.label} className="bg-background rounded-xl p-3 border border-black/5">
                      <p className="text-xl mb-1">{s.icon}</p>
                      <p className="font-semibold">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[520px] flex flex-col items-center justify-center bg-surface border border-black/5 rounded-2xl p-12 text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="font-bold font-heading text-text-primary">Analyzing {formData.quantity}q of {formData.commodityName}...</p>
                <p className="text-sm text-text-secondary mt-1">Scanning {formData.maxDistance}km radius across mandis & verified buyers</p>
              </motion.div>
            )}

            {result && !loading && (
              <motion.div key={`results-${formData.commodityName}-${formData.quantity}-${formData.maxDistance}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

                {/* Summary strip */}
                <div className="bg-surface border border-black/5 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-text-secondary">
                    <span className="bg-background px-3 py-1.5 rounded-full border border-black/5">🌾 {formData.commodityName}</span>
                    <span className="bg-background px-3 py-1.5 rounded-full border border-black/5">📦 {formData.quantity}q</span>
                    <span className="bg-background px-3 py-1.5 rounded-full border border-black/5">📍 ≤{formData.maxDistance}km</span>
                    <span className="bg-background px-3 py-1.5 rounded-full border border-black/5">⏰ {formData.urgencyDays} days</span>
                  </div>
                  <button onClick={handleReset} className="text-xs font-bold text-primary underline underline-offset-2 hover:text-primary-dark">
                    Change inputs
                  </button>
                </div>

                {/* Timing */}
                <div className={`p-5 rounded-2xl border flex gap-4 items-start ${result.trend?.indicator === 'SELL NOW' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50/50 border-blue-100'}`}>
                  {result.trend?.indicator === 'SELL NOW'
                    ? <AlertTriangle className="text-amber-600 h-7 w-7 flex-shrink-0 mt-0.5" />
                    : <Info className="text-blue-500 h-7 w-7 flex-shrink-0 mt-0.5" />
                  }
                  <div>
                    <h3 className={`font-bold text-lg font-heading ${result.trend?.indicator === 'SELL NOW' ? 'text-amber-700' : 'text-blue-700'}`}>
                      Timing: {result.trend?.indicator} <span className="text-sm font-normal opacity-70">({result.trend?.confidence} confidence)</span>
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">{result.trend?.reason}</p>
                  </div>
                </div>

                {/* Top recommendation */}
                {result.recommendations?.length > 0 && (
                  <div className="bg-surface rounded-2xl overflow-hidden shadow-lg border-2 border-primary/60">
                    <div className="bg-primary p-5">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
                        <CheckCircle className="h-6 w-6" /> #1 Recommended Selling Option
                      </h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold font-heading text-text-primary">{result.recommendations[0].name}</h3>
                          <div className="flex items-center gap-3 mt-2 text-sm text-text-secondary">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${result.recommendations[0].type === 'MARKET' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                              {result.recommendations[0].type === 'MARKET'
                                ? <><MapPin className="h-3 w-3 inline mr-1" />APMC Market</>
                                : <><ShieldCheck className="h-3 w-3 inline mr-1" />Verified Buyer</>}
                            </span>
                            {result.recommendations[0].distance && <span>{result.recommendations[0].distance} km away</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-secondary uppercase font-semibold tracking-wider">Expected Net Realisation</p>
                          <p className="text-3xl font-bold font-heading text-emerald-700">{fmt(result.recommendations[0].enrBreakdown?.expectedNetRealisation)}</p>
                        </div>
                      </div>

                      <div className="bg-emerald-50/60 p-5 rounded-xl border border-emerald-100">
                        <p className="font-bold text-primary-dark mb-2 font-heading">Why this option?</p>
                        <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                          {result.recommendations[0].explanation?.map((exp, i) => <li key={i}>{exp}</li>)}
                          <li>Highest Expected Net Realisation for your specific constraints.</li>
                        </ul>
                      </div>

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
                                <td className={`py-3 ${row.neg ? 'text-red-600' : 'text-text-primary'}`}>{row.neg ? '−' : ''} {row.label}</td>
                                <td className={`py-3 text-right font-medium ${row.neg ? 'text-red-600' : ''}`}>{row.neg ? '− ' : ''}{fmt(row.value)}</td>
                              </tr>
                            ))}
                            {result.recommendations[0].enrBreakdown?.riskAdjustment > 0 && (
                              <tr className="border-b border-black/5">
                                <td className="py-3 text-amber-600">− Unverified Buyer Risk Penalty</td>
                                <td className="py-3 text-right font-medium text-amber-600">− {fmt(result.recommendations[0].enrBreakdown.riskAdjustment)}</td>
                              </tr>
                            )}
                            <tr className="bg-emerald-50 font-bold text-text-primary">
                              <td className="py-4 px-3 rounded-l-xl">Expected Net Realisation</td>
                              <td className="py-4 px-3 text-right text-xl text-emerald-700 rounded-r-xl">{fmt(result.recommendations[0].enrBreakdown?.expectedNetRealisation)}</td>
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
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${alt.type === 'MARKET' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
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