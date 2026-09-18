import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  LayoutDashboard, 
  PlusCircle,
  Package, 
  LogOut, 
  User, 
  Menu, 
  MapPin, 
  ShieldCheck,
  UserCircle,
  Tractor,
  HelpCircle,
  Store
} from 'lucide-react';

export default function Layout() {
  const { user, isBuyer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = 
    user?.farmerProfile?.name || 
    user?.buyerProfile?.companyName || 
    user?.buyerProfile?.name || 
    user?.email?.split('@')[0] || 
    'Ramesh Patel';

  const roleLabel = isBuyer ? 'Verified Buyer' : 'Farmer (Seller)';

  // Navigation Items matching requested names
  let navItems = [];

  if (isBuyer) {
    navItems = [
      { name: 'Marketplace', path: '/offers', icon: <Store className="h-5 w-5" /> },
      { name: 'Trade Center', path: '/markets', icon: <MapPin className="h-5 w-5" /> },
      { name: 'Sell Crop', path: '/recommendation', icon: <PlusCircle className="h-5 w-5 text-emerald-600" /> },
      { name: 'Support', path: '/support', icon: <HelpCircle className="h-5 w-5" /> },
      { name: displayName, path: '/profile', icon: <UserCircle className="h-5 w-5" /> },
    ];
  } else {
    // Farmer / Seller Navigation
    navItems = [
      { name: 'Dashboard', path: '/farmer/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
      { name: 'Marketplace', path: '/markets', icon: <Store className="h-5 w-5" /> },
      { name: 'Sell Crop', path: '/recommendation', icon: <PlusCircle className="h-5 w-5 text-primary" /> },
      { name: 'Trade Center', path: '/offers', icon: <Package className="h-5 w-5" /> },
      { name: 'Support', path: '/support', icon: <HelpCircle className="h-5 w-5" /> },
      { name: displayName, path: '/profile', icon: <UserCircle className="h-5 w-5" /> },
    ];
  }

  return (
    <div className="min-h-screen flex bg-background font-sans text-text-primary selection:bg-primary selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-black/5 hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="h-20 flex items-center px-6 border-b border-black/5">
          <Sprout className="h-8 w-8 text-secondary mr-2" />
          <div>
            <span className="text-2xl font-bold font-heading text-primary-dark tracking-tight leading-none block">AgriConnect</span>
            <span className="text-[10px] font-semibold tracking-wider text-text-secondary uppercase">Precision Agritech</span>
          </div>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-text-secondary/70 uppercase tracking-widest mb-2">Main Menu</p>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md font-semibold' 
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`
              }
            >
              {item.icon}
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* User Card in Sidebar Footer */}
        <div className="p-5 border-t border-black/5 bg-surface">
          <Link 
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-xl hover:bg-background/80 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary font-heading group-hover:border-primary/40 transition-colors">
              {displayName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold font-heading text-text-primary truncate">
                {displayName}
              </p>
              <span className="text-[10px] font-semibold text-text-secondary block truncate">
                {user?.email || '+91 ' + (user?.phone || '9876543210')}
              </span>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-danger hover:bg-danger/10 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-surface border-b border-black/5 flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center">
            <Sprout className="h-7 w-7 text-secondary mr-2" />
            <span className="text-xl font-bold font-heading text-primary-dark">AgriConnect</span>
          </div>
          <button className="text-text-secondary hover:text-text-primary bg-background p-2 rounded-lg">
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
