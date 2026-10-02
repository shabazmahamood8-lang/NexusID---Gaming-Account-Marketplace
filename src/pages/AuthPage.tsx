import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useToast } from '../context/ToastContext.tsx';
import { Gamepad2, Lock, Mail, User as UserIcon, Phone, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  navigate: (path: string) => void;
  redirectPath?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  navigate,
  redirectPath = '/dashboard',
}) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          error('Please provide your full name');
          setIsSubmitting(false);
          return;
        }
        const res = await register(name, email, password, phone);
        if (res.success) {
          success('Welcome to NexusID! Your account was created.');
          navigate(redirectPath);
        } else {
          error(res.message || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          success('Logged in successfully!');
          navigate(redirectPath);
        } else {
          error(res.message || 'Invalid credentials');
        }
      }
    } catch (err: any) {
      error(err.message || 'An error occurred during authentication');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo fill buttons for smooth testing
  const handleQuickDemoCustomer = async () => {
    setEmail('customer@nexusid.store');
    setPassword('customer123456');
    const res = await login('customer@nexusid.store', 'customer123456');
    if (res.success) {
      success('Logged in as Demo Customer (Rahim Ahmed)');
      navigate(redirectPath);
    } else {
      error(res.message || 'Quick login failed');
    }
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@nexusid.store');
    setPassword('admin123456');
    const res = await login('admin@nexusid.store', 'admin123456');
    if (res.success) {
      success('Logged in as Super Admin');
      navigate('/admin');
    } else {
      error(res.message || 'Quick login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Brand logo header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-xl shadow-emerald-500/20">
          <Gamepad2 className="w-7 h-7 text-slate-950" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {isRegister ? 'Create Your Gamer Account' : 'Welcome Back to NexusID'}
        </h2>
        <p className="text-xs text-slate-400">
          {isRegister
            ? 'Sign up to purchase verified gaming accounts with escrow protection.'
            : 'Access your purchased IDs, order status, and delivery credentials.'}
        </p>
      </div>

      {/* Main Auth Form Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-md space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahim Ahmed"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gamertag@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711223344"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              'Processing...'
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Register/Login */}
        <div className="text-center pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="font-semibold text-emerald-400 hover:text-emerald-300 ml-1 underline"
            >
              {isRegister ? 'Sign In here' : 'Register now'}
            </button>
          </p>
        </div>
      </div>

      {/* 1-Click Demo Accounts Box for testing convenience */}
      <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 space-y-2.5">
        <span className="text-[11px] font-mono text-slate-400 block uppercase font-semibold text-center">
          Instant Test Accounts
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleQuickDemoCustomer}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            Customer Demo
          </button>
          <button
            type="button"
            onClick={handleQuickDemoAdmin}
            className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Admin Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
