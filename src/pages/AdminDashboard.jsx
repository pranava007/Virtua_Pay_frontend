import { Link } from "react-router-dom";
import { Settings, CreditCard, LayoutDashboard, History, ShoppingBag } from "lucide-react";
import MerchantStats from "../components/MerchantStats";

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-yellow-600">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-black uppercase tracking-widest">Super Admin Console</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Command Center</h1>
          <p className="text-gray-500 text-lg font-medium">Monitor your global payment ecosystem and merchant performance.</p>
        </div>

        <div className="flex gap-4">
          <Link
            to="/settings"
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-500/20"
          >
            <Settings className="w-5 h-5" />
            Config
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg shadow-gray-900/10"
          >
            <ShoppingBag className="w-5 h-5" />
            Catalog
          </Link>
        </div>
      </div>

      {/* MAIN ANALYTICS SECTION */}
      <MerchantStats />

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group bg-gradient-to-br from-gray-900 to-black p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
              <History className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Transaction Logs</h3>
              <p className="text-gray-400 font-medium">Deep dive into every payment attempt across the platform.</p>
            </div>
            <button className="px-6 py-3 bg-white text-black font-black text-sm rounded-xl hover:bg-yellow-500 transition-colors uppercase">
              View All Logs
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-500/20 blur-[80px] rounded-full" />
        </div>

        <div className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900">Payment Infrastructure</h3>
              <p className="text-gray-500 font-medium">Manage default fallback gateways and system-wide API limits.</p>
            </div>
          </div>
          <Link to="/settings" className="text-yellow-600 font-black text-sm uppercase hover:underline flex items-center gap-2">
            System Config <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};

function ArrowRight({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}

export default AdminDashboard;