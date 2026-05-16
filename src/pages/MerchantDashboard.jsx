import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Package, 
  CreditCard, 
  History, 
  ArrowUpRight, 
  Zap, 
  Key, 
  Settings as SettingsIcon,
  ShoppingBag,
  Loader2
} from "lucide-react";
import api from "../services/api";

const MerchantDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/merchant-stats/self");
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <Loader2 className="animate-spin w-10 h-10 text-yellow-500" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-10">
      
      {/* WELCOME HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-xs font-black uppercase tracking-widest">Merchant Performance</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Store Overview</h1>
          <p className="text-gray-500 font-medium mt-1 text-lg">Track your sales and manage your payment integrations.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/settings" className="px-5 py-2.5 bg-gray-50 text-gray-600 font-bold rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Key className="w-4 h-4" /> API Key
          </Link>
          <Link to="/history" className="px-5 py-2.5 bg-yellow-500 text-black font-black rounded-xl shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all flex items-center gap-2 uppercase text-xs">
            View Orders <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Today's Revenue" 
          value={`₹${(stats?.revenue?.daily || 0).toLocaleString()}`} 
          icon={<TrendingUp className="text-emerald-600" />} 
          bg="bg-emerald-50"
        />
        <StatCard 
          label="Weekly Sales" 
          value={`₹${(stats?.revenue?.weekly || 0).toLocaleString()}`} 
          icon={<CreditCard className="text-blue-600" />} 
          bg="bg-blue-50"
        />
        <StatCard 
          label="Monthly Target" 
          value={`₹${(stats?.revenue?.monthly || 0).toLocaleString()}`} 
          icon={<Zap className="text-amber-600" />} 
          bg="bg-amber-50"
        />
        <StatCard 
          label="Overall Turnover" 
          value={`₹${(stats?.revenue?.overall || 0).toLocaleString()}`} 
          icon={<ShoppingBag className="text-purple-600" />} 
          bg="bg-purple-50"
        />
      </div>

      {/* QUICK ACTIONS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ACTION CARDS */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard 
            title="Gateway Config"
            desc="Setup Razorpay, Cashfree or other providers."
            icon={<SettingsIcon className="w-8 h-8 text-yellow-600" />}
            link="/settings"
            color="yellow"
          />
          <ActionCard 
            title="Product Catalog"
            desc="Manage items for your hosted storefront."
            icon={<Package className="w-8 h-8 text-blue-600" />}
            link="/products"
            color="blue"
          />
        </div>

        {/* SIDE MINI LOGS */}
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <History className="text-yellow-500 w-6 h-6" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Recent Sales</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                You have received <strong>{stats?.orders || 0}</strong> total orders. Check your history for detailed breakdown.
              </p>
              <Link to="/history" className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-xl text-sm font-bold uppercase tracking-widest">
                Full History
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full" />
        </div>

      </div>

    </div>
  );
};

const StatCard = ({ label, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-4">
    <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <h4 className="text-2xl font-black text-gray-900">{value}</h4>
    </div>
  </div>
);

const ActionCard = ({ title, desc, icon, link, color }) => (
  <Link to={link} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 hover:border-yellow-500/50 transition-all">
    <div className={`w-14 h-14 bg-${color}-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 font-medium text-sm mb-4">{desc}</p>
    <div className="flex items-center gap-2 text-yellow-600 text-xs font-black uppercase tracking-widest">
      Manage <ArrowUpRight className="w-3 h-3" />
    </div>
  </Link>
);

export default MerchantDashboard;
