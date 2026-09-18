import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ShieldCheck,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueType, setIssueType] = useState('Delayed payment');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/tickets');
      setTickets(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading tickets:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please provide a brief description of the issue.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post('/api/tickets', {
        issueType,
        description
      });
      setTickets(prev => [res.data, ...prev]);
      setDescription('');
      setNotification(`Ticket ${res.data.id} registered successfully. APMC mediation team has been notified.`);
      setTimeout(() => setNotification(null), 6000);
    } catch (err) {
      console.error('Error submitting ticket:', err);
      alert('Failed to submit dispute ticket. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header bar with location */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary-dark tracking-tight">
            Support & Disputes
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Raise a ticket and track its resolution status with verified APMC officers.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary bg-surface px-3 py-1.5 rounded-full border border-black/5 shadow-sm self-start sm:self-auto">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>Nashik, Maharashtra</span>
          <span className="h-2 w-2 rounded-full bg-success"></span>
        </div>
      </div>

      {/* Info Notification Banner */}
      {notification ? (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-success/10 border border-success/20 text-success text-sm font-semibold flex items-center gap-2.5 shadow-sm"
        >
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{notification}</span>
        </motion.div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-xs font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700 flex-shrink-0" />
            All registered transactions through AgriConnect are backed by APMC Mandi Dispute Resolution Tribunal regulations (24-48 hour resolution window).
          </span>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md hidden md:inline">
            Fast-Track Protocol
          </span>
        </div>
      )}

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Open a ticket Form */}
        <div className="lg:col-span-5">
          <div className="bg-surface rounded-3xl border border-black/5 p-7 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold font-heading text-text-primary mb-1">
              Open a ticket
            </h2>
            <p className="text-xs text-text-secondary mb-6">
              Select your dispute category and describe the situation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Issue Category
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-background border-black/10 rounded-xl p-3.5 text-sm font-medium border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="Delayed payment">Delayed payment</option>
                  <option value="Quality dispute">Quality dispute</option>
                  <option value="Delivery issue">Delivery issue</option>
                  <option value="Listing issue">Listing issue</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide transaction number, buyer name, produce details, and nature of the dispute..."
                  className="w-full bg-background border-black/10 rounded-xl p-3.5 text-sm border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting...' : 'Submit ticket'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Your tickets List */}
        <div className="lg:col-span-7">
          <div className="bg-surface rounded-3xl border border-black/5 p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
              <div>
                <h2 className="text-lg font-bold font-heading text-text-primary">
                  Your tickets
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Track arbitration and status updates for your raised claims.
                </p>
              </div>
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                {tickets.length} Active
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 bg-background rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-16 text-center text-text-secondary">
                <FileText className="h-10 w-10 mx-auto text-text-secondary/40 mb-3" />
                <p className="font-semibold text-sm">No tickets created yet.</p>
                <p className="text-xs text-text-secondary/70 mt-1">
                  When you raise a ticket, you can monitor resolution progress here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-black/5 bg-background/50 hover:bg-background transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">
                            {t.id}
                          </span>
                          <span className="text-xs font-bold text-text-primary">
                            · {t.issueType}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                          {t.description}
                        </p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 flex-shrink-0 ${
                        t.status === 'Resolved'
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-warning/10 text-warning border border-warning/20'
                      }`}>
                        {t.status === 'Resolved' ? (
                          <><CheckCircle2 className="h-3 w-3" /> Resolved</>
                        ) : (
                          <><Clock className="h-3 w-3" /> Under Review</>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-secondary mt-3 pt-3 border-t border-black/5">
                      <span>Submitted on {new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="font-semibold text-primary">APMC Arbitrator Assigned</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
