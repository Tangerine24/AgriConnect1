import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, TrendingUp, ShieldCheck, Calculator, MapPin } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary selection:text-white">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel bg-surface/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold font-heading text-primary-dark tracking-tight">AgriConnect</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-text-secondary">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#market" className="hover:text-primary transition-colors">Markets</a>
            <a href="#buyers" className="hover:text-primary transition-colors">Buyers</a>
            <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">Sign In</Link>
            <Link to="/login" className="bg-primary text-white px-6 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-secondary/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[80px]" />
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success font-semibold text-sm mb-6 border border-success/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              SIH 2026 Live Prototype
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-heading text-primary-dark leading-tight mb-6">
              Sell Smarter.<br />
              <span className="text-accent">Earn Better.</span>
            </h1>
            <p className="text-xl text-text-secondary mb-10 max-w-lg leading-relaxed">
              AgriConnect helps farmers discover where, when and to whom to sell by comparing market prices, logistics, demand, and real-world constraints for the highest net realization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Find Best Market
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/markets" className="flex items-center justify-center gap-2 bg-white text-text-primary px-8 py-4 rounded-full text-lg font-semibold shadow-sm border border-black/5 hover:bg-gray-50 transition-all duration-300">
                Explore Markets
              </Link>
            </div>
          </motion.div>

          {/* 3D-Style Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
            className="relative perspective-1000"
          >
            <div className="relative z-10 glass-panel rounded-3xl p-8 transform rotate-y-12 shadow-2xl border border-white/50">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-text-secondary font-medium mb-1">Expected Net Realisation</h3>
                  <div className="text-4xl font-bold font-heading text-primary-dark">₹4,250 <span className="text-lg text-text-secondary font-normal">/ quintal</span></div>
                </div>
                <div className="bg-success/10 text-success p-2 rounded-lg flex items-center gap-1 font-bold">
                  <TrendingUp className="h-4 w-4" /> +12%
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between border border-white/40 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-info/10 p-3 rounded-xl text-info"><MapPin className="h-5 w-5" /></div>
                    <div>
                      <div className="font-semibold text-primary-dark">Nashik APMC</div>
                      <div className="text-sm text-text-secondary">Highest realization after transport</div>
                    </div>
                  </div>
                  <div className="text-right font-bold text-primary-dark">45 km</div>
                </div>

                <div className="bg-white/60 p-4 rounded-2xl flex items-center justify-between border border-white/40 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-warning/10 p-3 rounded-xl text-warning"><ShieldCheck className="h-5 w-5" /></div>
                    <div>
                      <div className="font-semibold text-primary-dark">Verified Buyers</div>
                      <div className="text-sm text-text-secondary">3 active bids today</div>
                    </div>
                  </div>
                  <div className="text-right font-bold text-primary-dark">High Demand</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-24 bg-surface" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-primary-dark mb-4">More than just Mandi prices</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">We calculate the true value of your harvest by factoring in real-world constraints, not just the headline rate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "WHERE?", desc: "Find the market with the best expected net realization.", icon: MapPin, color: "text-info", bg: "bg-info/10" },
              { title: "WHO?", desc: "Discover verified and reliable buyers directly.", icon: ShieldCheck, color: "text-success", bg: "bg-success/10" },
              { title: "WHEN?", desc: "Compare selling now versus waiting for better rates.", icon: TrendingUp, color: "text-warning", bg: "bg-warning/10" },
              { title: "HOW MUCH?", desc: "Calculate expected net realization after costs.", icon: Calculator, color: "text-primary", bg: "bg-primary/10" }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-background rounded-3xl p-8 border border-black/5 shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className={`${card.bg} ${card.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <card.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold font-heading text-primary-dark mb-3">{card.title}</h3>
                <p className="text-text-secondary leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
