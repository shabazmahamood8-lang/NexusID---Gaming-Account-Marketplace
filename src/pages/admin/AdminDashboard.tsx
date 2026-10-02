import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import {
  Gamepad2,
  ShoppingBag,
  Users,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  PlusCircle,
  Settings,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (path: string) => void;
  currencySymbol?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  navigate,
  currencySymbol = '৳',
}) => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<any>({
    totalIds: 0,
    availableIds: 0,
    soldIds: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          api.getStats(),
          api.getOrders(),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (ordersRes.success && ordersRes.data) {
          setRecentOrders(ordersRes.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-400">
          You must be logged in as an administrator to access this management area.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>NEXUSID ADMINISTRATION CONSOLE</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Marketplace Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Welcome, {user?.name}. Manage gaming IDs, customer orders, reviews, and payment instructions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/ids/create')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            Add New ID Listing
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 text-xs font-semibold hover:border-slate-500 transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* KPI Stats Grid per PRD section 12 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total IDs</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{stats.totalIds}</span>
            <Gamepad2 className="w-4 h-4 text-emerald-400/80" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Available IDs</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{stats.availableIds}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400/80" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Sold IDs</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">{stats.soldIds}</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400/80" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Orders</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{stats.totalOrders}</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Pending Orders</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{stats.pendingOrders}</span>
            <Clock className="w-4 h-4 text-amber-400/80" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Total Customers</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-purple-400 tabular-nums">{stats.totalCustomers}</span>
            <Users className="w-4 h-4 text-purple-400/80" />
          </div>
        </div>
      </div>

      {/* Revenue Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase">Total Cleared Marketplace Volume</span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
            {currencySymbol}{stats.totalRevenue.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Review Orders
          </button>
        </div>
      </div>

      {/* Fast Navigation Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/admin/ids')}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Manage ID Listings</h3>
          <p className="text-xs text-slate-400 mt-1">Edit, delete, toggle status, and upload screenshots</p>
        </button>

        <button
          onClick={() => navigate('/admin/orders')}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Order Verification & Delivery</h3>
          <p className="text-xs text-slate-400 mt-1">Review TrxIDs and input account login handover</p>
        </button>

        <button
          onClick={() => navigate('/admin/reviews')}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Customer Reviews Moderation</h3>
          <p className="text-xs text-slate-400 mt-1">Approve or delete verified feedback</p>
        </button>

        <button
          onClick={() => navigate('/admin/users')}
          className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">User Accounts</h3>
          <p className="text-xs text-slate-400 mt-1">View registered customers and promote admins</p>
        </button>
      </div>

      {/* Recent Orders Overview */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Pending & Recent Orders</h2>
            <p className="text-xs text-slate-400">Needs admin verification, payment check, or credential handover</p>
          </div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            All Orders →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <tr>
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Game / Listing</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/30">
                    <td className="py-3 font-mono text-slate-400">{o._id.substring(0, 10)}...</td>
                    <td className="py-3 font-medium text-white">{o.customerName}</td>
                    <td className="py-3 truncate max-w-[200px]">
                      {typeof o.listing === 'object' ? o.listing?.title : 'Gaming ID'}
                    </td>
                    <td className="py-3 font-mono text-emerald-400 font-semibold tabular-nums">
                      {currencySymbol}{o.price?.toLocaleString()}
                    </td>
                    <td className="py-3 uppercase font-mono">{o.paymentMethod}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                          o.status === 'delivered'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : o.status === 'confirmed'
                            ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => navigate('/admin/orders')}
                        className="text-emerald-400 hover:underline font-semibold"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
