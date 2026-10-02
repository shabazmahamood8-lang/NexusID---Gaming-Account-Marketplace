import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  User as UserIcon,
  ChevronRight,
  Lock,
  Gamepad2,
} from 'lucide-react';

interface CustomerDashboardProps {
  navigate: (path: string) => void;
  currencySymbol?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  navigate,
  currencySymbol = '৳',
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await api.getOrders();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (e) {
        console.error('Failed to load user orders:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const totalSpent = orders
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + (o.price || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 font-bold text-xl flex items-center justify-center border border-emerald-500/40 uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Hello, {user?.name || 'Gamer'}!</h1>
            <p className="text-xs text-slate-400">
              {user?.email} · <span className="font-mono text-emerald-400 capitalize">{user?.role} Account</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/ids')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            Browse IDs
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 text-xs font-semibold hover:border-slate-500 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Orders</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalOrders}</span>
            <ShoppingBag className="w-5 h-5 text-emerald-400/80" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Active / Processing</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{pendingOrders}</span>
            <Clock className="w-5 h-5 text-amber-400/80" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Delivered IDs</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{deliveredOrders}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400/80" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Invested</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {currencySymbol}{totalSpent.toLocaleString()}
            </span>
            <Lock className="w-5 h-5 text-cyan-400/80" />
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Gaming ID Orders</h2>
            <p className="text-xs text-slate-400">Track delivery status and retrieve your login credentials</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            All Orders ({orders.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
            Loading recent orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl space-y-3">
            <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">You haven't placed any gaming ID orders yet.</p>
            <button
              onClick={() => navigate('/ids')}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Explore Available Accounts
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {orders.slice(0, 5).map((order) => {
              const listingTitle = typeof order.listing === 'object' ? order.listing?.title : 'Gaming Account ID';
              const listingGame = typeof order.listing === 'object' ? order.listing?.game : 'Game';
              const isDelivered = order.status === 'delivered';

              return (
                <div key={order._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                        {listingGame}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white">{listingTitle}</h4>
                    <p className="text-xs font-mono text-slate-300">
                      Amount: <strong className="text-emerald-400">{currencySymbol}{order.price.toLocaleString()}</strong> via{' '}
                      <span className="uppercase">{order.paymentMethod}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono uppercase px-2.5 py-1 rounded font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          : order.status === 'cancelled'
                          ? 'bg-rose-950 border border-rose-500/40 text-rose-300'
                          : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                      }`}
                    >
                      {order.status}
                    </span>

                    <button
                      onClick={() => navigate('/dashboard/orders')}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
                    >
                      {isDelivered ? 'View Credentials' : 'Track Order'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
