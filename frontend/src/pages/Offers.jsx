import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Package, ShieldCheck, Check, AlertCircle, Star, Loader2 } from 'lucide-react';

export default function Offers() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = () => {
    setLoading(true);
    axios.get('/api/listings')
      .then(res => {
        setListings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAcceptOffer = async (offerId) => {
    if (!window.confirm('Accept this offer? The listing will be marked as sold.')) return;
    try {
      await axios.post(`/api/offers/${offerId}/accept`);
      fetchListings();
    } catch {
      alert('Error accepting offer. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-10 w-64 bg-background rounded-lg animate-pulse" />
        {[1, 2].map(i => (
          <div key={i} className="bg-surface rounded-2xl border border-black/5 overflow-hidden">
            <div className="h-20 bg-background animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-6 w-48 bg-background rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(j => <div key={j} className="h-40 bg-background rounded-xl animate-pulse" />)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-primary-dark tracking-tight flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary"><Package className="h-7 w-7" /></div>
          My Produce & Offers
        </h1>
        <p className="text-text-secondary mt-2">Review incoming bids from buyers for your active listings.</p>
      </div>

      <div className="space-y-8">
        {listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-surface border-2 border-dashed border-black/10 rounded-2xl p-16 text-center">
            <div className="bg-primary/10 p-4 rounded-2xl mb-6"><Package className="h-10 w-10 text-primary" /></div>
            <p className="text-text-secondary text-lg">No active produce listings found.</p>
            <p className="text-text-secondary text-sm mt-1">Create your first listing to start receiving offers from buyers.</p>
          </div>
        ) : (
          listings.map((listing, listIdx) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: listIdx * 0.1 }}
              className="bg-surface rounded-2xl shadow-sm border border-black/5 overflow-hidden"
            >
              {/* Listing Header */}
              <div className="bg-primary/5 p-5 border-b border-black/5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-xl font-bold font-heading text-primary-dark">
                    {listing.quantity} Quintals of {listing.commodity?.name}
                  </h2>
                  <p className="text-sm text-text-secondary mt-0.5">
                    Expected: ₹{listing.expectedPrice?.toLocaleString('en-IN')}/q · {listing.location}
                  </p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold self-start ${
                  listing.status === 'ACTIVE' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'
                }`}>
                  {listing.status}
                </span>
              </div>

              {/* Offers */}
              <div className="p-6">
                <h3 className="text-base font-bold font-heading text-text-primary mb-4">
                  Buyer Offers ({listing.offers?.length || 0})
                </h3>

                {(!listing.offers || listing.offers.length === 0) ? (
                  <p className="text-text-secondary text-sm py-4">No offers received yet. Your listing is visible to buyers.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {listing.offers.map((offer, offerIdx) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: offerIdx * 0.05 }}
                        className={`rounded-xl p-5 border transition-all hover:shadow-md ${
                          offer.status === 'ACCEPTED'
                            ? 'bg-success/5 border-success/20'
                            : 'bg-background border-black/5 hover:border-primary/30'
                        }`}
                      >
                        {/* Buyer Info */}
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-text-primary text-sm leading-tight">
                            {offer.buyer?.companyName || offer.buyer?.name || 'Unknown Buyer'}
                          </h4>
                          {offer.buyer?.verificationStatus === 'VERIFIED' ? (
                            <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 flex-shrink-0">
                              <ShieldCheck className="h-2.5 w-2.5" /> Verified
                            </span>
                          ) : (
                            <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 flex-shrink-0">
                              <AlertCircle className="h-2.5 w-2.5" /> Unverified
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <p className="text-2xl font-bold font-heading text-primary-dark mb-1">
                          ₹{offer.offerPrice?.toLocaleString('en-IN')}
                          <span className="text-sm font-normal text-text-secondary ml-1">/ quintal</span>
                        </p>

                        {/* Reliability */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-text-secondary mb-1">
                            <span>Reliability</span>
                            <span className="font-semibold">{offer.buyer?.reliabilityScore || 0}/100</span>
                          </div>
                          <div className="w-full bg-black/5 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                (offer.buyer?.reliabilityScore || 0) >= 80 ? 'bg-success' :
                                (offer.buyer?.reliabilityScore || 0) >= 50 ? 'bg-warning' : 'bg-danger'
                              }`}
                              style={{ width: `${Math.min(offer.buyer?.reliabilityScore || 0, 100)}%` }}
                            />
                          </div>
                          {offer.buyer?.completedTransactions > 0 && (
                            <p className="text-[11px] text-text-secondary mt-1.5 flex items-center gap-1">
                              <Star className="h-3 w-3" /> {offer.buyer.completedTransactions} completed transactions
                            </p>
                          )}
                        </div>

                        {/* Action */}
                        {listing.status === 'ACTIVE' && offer.status === 'PENDING' ? (
                          <button
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-1.5 text-sm"
                          >
                            <Check className="h-4 w-4" /> Accept Offer
                          </button>
                        ) : (
                          <div className={`text-center py-2.5 font-bold text-sm rounded-xl ${
                            offer.status === 'ACCEPTED' ? 'bg-success/10 text-success' : 'bg-black/5 text-text-secondary'
                          }`}>
                            {offer.status === 'ACCEPTED' ? '✓ Accepted' : offer.status}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
