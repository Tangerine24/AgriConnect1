import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Sprout, Tractor, ShieldCheck, ArrowRight, X, Lock, User as UserIcon } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('farmer'); // 'farmer' | 'buyer'
  const [username, setUsername] = useState('farmer');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
    if (newRole === 'farmer') {
      setUsername('farmer');
    } else {
      setUsername('buyer');
    }
  };

  const redirectAfterLogin = (userRole) => {
    if (userRole === 'buyer') {
      navigate('/offers');
    } else {
      navigate('/farmer/dashboard');
    }
  };

  const handleLoginSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', {
        username,
        password,
        role
      });
      login(res.data.user);
      redirectAfterLogin(res.data.user.role);
    } catch (err) {
      console.error(err);
      alert('Invalid username or password. Please check your credentials.');
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async (email, name) => {
    setLoading(true);
    setShowGoogleModal(false);
    try {
      const user = await googleLogin({
        email: email || 'user@gmail.com',
        name: name || email.split('@')[0],
        role: role
      });
      redirectAfterLogin(user.role);
    } catch (err) {
      console.error(err);
      alert('Google sign in failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary selection:text-white relative">
      {/* Left Pane - Brand & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-dark relative overflow-hidden flex-col justify-between text-white p-12">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-primary/40 blur-[80px]" />
        
        {/* Brand Top */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
            <Sprout className="h-8 w-8 text-accent" />
          </div>
          <div>
            <span className="text-2xl font-bold font-heading tracking-tight block">AgriConnect</span>
            <span className="text-xs font-semibold tracking-wider text-white/70 uppercase">Precision Agritech Market Linkage</span>
          </div>
        </div>

        {/* Center Copy */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-6 border border-white/20 text-accent">
            🌾 Official eNAM & Agmarknet Connected Portal
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold font-heading leading-tight mb-4">
            Helping farmers decide WHERE, WHEN and TO WHOM to sell.
          </h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8">
            Empowering Indian agriculture with live APMC mandi price discovery, Sentinel satellite crop health intelligence, and direct verified buyer settlement.
          </p>

          <div className="grid grid-cols-2 gap-4 text-xs text-white/80">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-accent text-sm mb-1">20+ APMC Mandis</p>
              <p>Live modal prices and arrival feeds updated daily.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-bold text-accent text-sm mb-1">Guaranteed Settlement</p>
              <p>Verified buyers with APMC tribunal arbitration support.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/50">
          AgriConnect Platform · Problem Statement SIH26132
        </div>
      </div>

      {/* Right Pane - Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 xl:px-24 py-12 relative overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold font-heading text-text-primary mb-2">Sign In</h2>
            <p className="text-sm text-text-secondary">
              Enter your credentials or continue with your Google account.
            </p>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-black/15 py-3.5 px-4 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all font-semibold text-sm text-text-primary group"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span className="group-hover:text-primary transition-colors">Continue with Google</span>
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-black/10"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Or Sign in with Username</span>
            <div className="flex-grow border-t border-black/10"></div>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-surface p-1.5 rounded-2xl mb-6 border border-black/5 shadow-inner">
            <button 
              type="button"
              onClick={() => handleRoleSelect('farmer')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'farmer' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Tractor className="h-4 w-4" /> Farmer (Seller)
            </button>
            <button 
              type="button"
              onClick={() => handleRoleSelect('buyer')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                role === 'buyer' 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <ShieldCheck className="h-4 w-4" /> Verified Buyer
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 bg-surface border-black/10 rounded-xl shadow-sm p-3.5 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium" 
                  placeholder="Enter your username or email" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 bg-surface border-black/10 rounded-xl shadow-sm p-3.5 border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm" 
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold text-base flex justify-center items-center gap-2 mt-6"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

        </div>
      </div>

      {/* Google Sign In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/10 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-black/5">
              <div className="flex items-center gap-2">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <h3 className="font-bold font-heading text-lg text-text-primary">Sign in with Google</h3>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-full text-text-secondary hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-text-secondary mb-4">
              Enter your Google Account email to continue to <span className="font-bold text-text-primary">AgriConnect</span>:
            </p>

            {/* Google Account Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (googleEmailInput) {
                  handleGoogleSignIn(googleEmailInput, googleNameInput);
                }
              }}
              className="space-y-3 mb-5"
            >
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Google / Gmail Address</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="w-full bg-background border-black/10 rounded-xl p-3 text-sm border outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  className="w-full bg-background border-black/10 rounded-xl p-3 text-sm border outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      role === 'farmer' ? 'bg-primary text-white border-primary' : 'bg-background border-black/10'
                    }`}
                  >
                    🌾 Farmer (Seller)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      role === 'buyer' ? 'bg-primary text-white border-primary' : 'bg-background border-black/10'
                    }`}
                  >
                    🏢 Buyer
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-primary text-white py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                Sign In with Google
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
