import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Gamepad2,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
  ShoppingBag,
  LogOut,
  Flame,
  Search,
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  announcement?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, announcement }) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Marketplace', path: '/ids' },
    { label: 'Popular Games', path: '/ids?sort=popular' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'Customer Reviews', path: '/#reviews' },
    { label: 'About Us', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Support', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Announcement Bar */}
      {announcement && (
        <div className="bg-gradient-to-r from-emerald-950/80 via-cyan-950/80 to-slate-950 border-b border-emerald-500/20 px-4 py-1.5 text-center text-xs text-emerald-300 font-medium flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{announcement}</span>
          <button
            onClick={() => handleNav('/ids')}
            className="underline hover:text-emerald-100 transition-colors ml-1 font-semibold"
          >
            Shop Now →
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Nexus<span className="text-emerald-400">ID</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-mono text-emerald-500/80 bg-emerald-950/80 border border-emerald-500/30 px-1 rounded">
                  Escrow
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal leading-none">Gaming Marketplace</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                  currentPath === link.path ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & User Menu */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNav('/ids')}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
              title="Search IDs"
            >
              <Search className="w-4 h-4" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-200 transition-all text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase border border-emerald-500/40">
                    {user.name.charAt(0)}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                  {isAdmin && (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ADMIN
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-800 text-xs">
                      <p className="font-semibold text-slate-200">{user.name}</p>
                      <p className="text-slate-400 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <>
                        <div className="px-3 py-1 text-[10px] uppercase font-mono text-amber-400 font-semibold mt-1">
                          Admin Operations
                        </div>
                        <button
                          onClick={() => handleNav('/admin')}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          Admin Dashboard
                        </button>
                        <button
                          onClick={() => handleNav('/admin/ids')}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                          Manage IDs
                        </button>
                        <button
                          onClick={() => handleNav('/admin/orders')}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                          Manage Orders
                        </button>
                        <div className="border-t border-slate-800 my-1"></div>
                      </>
                    )}

                    <div className="px-3 py-1 text-[10px] uppercase font-mono text-emerald-400 font-semibold">
                      Customer Space
                    </div>
                    <button
                      onClick={() => handleNav('/dashboard')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => handleNav('/dashboard/orders')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                      My Orders & Credentials
                    </button>
                    <button
                      onClick={() => handleNav('/dashboard/profile')}
                      className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      Profile Settings
                    </button>

                    <div className="border-t border-slate-800 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-300 hover:bg-rose-950/30 rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-left px-3 py-2 text-sm rounded-lg ${
                  currentPath === link.path
                    ? 'bg-emerald-950/40 text-emerald-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="border-t border-slate-800 pt-3">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-slate-400">
                  Signed in as <strong className="text-white">{user.name}</strong> ({user.role})
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleNav('/admin')}
                    className="w-full text-left px-3 py-2 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-sm font-semibold flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Control Center
                  </button>
                )}
                <button
                  onClick={() => handleNav('/dashboard')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 rounded-lg"
                >
                  Customer Dashboard
                </button>
                <button
                  onClick={() => handleNav('/dashboard/orders')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 rounded-lg"
                >
                  My Purchased IDs
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:bg-slate-900 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full py-2 text-center text-sm font-medium rounded-lg border border-slate-800 text-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="w-full py-2 text-center text-sm font-semibold rounded-lg bg-emerald-500 text-slate-950"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
