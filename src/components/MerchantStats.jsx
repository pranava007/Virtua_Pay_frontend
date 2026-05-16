import { useEffect } from "react";
import { Users, TrendingUp, DollarSign, Package, Loader2, ArrowUpRight, ShieldCheck, ShieldAlert, Key as KeyIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMerchantStats } from "../redux/slices/adminSlice";
import { toast } from "react-hot-toast";

const MerchantStats = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchMerchantStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchMerchantStats());
  };

  const totalDaily = stats.reduce((acc, curr) => acc + (curr.revenue?.daily || 0), 0);
  const totalOverall = stats.reduce((acc, curr) => acc + (curr.revenue?.overall || 0), 0);
  const activeKeys = stats.filter(s => s.hasApiKey).length;

  if (loading) return <div className="animate-pulse h-64 bg-gray-50 rounded-3xl" />;

  return (
    <div className="space-y-8">
      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Revenue</p>
            <h4 className="text-2xl font-black text-gray-900">₹{totalDaily.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overall Platform Revenue</p>
            <h4 className="text-2xl font-black text-gray-900">₹{totalOverall.toLocaleString()}</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
            <KeyIcon className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Merchants</p>
            <h4 className="text-2xl font-black text-gray-900">{activeKeys} / {stats.length}</h4>
          </div>
        </div>
      </div>

      {/* MERCHANT TABLE */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-black text-gray-900">Merchant Revenue Summary</h3>
          </div>
          <button onClick={handleRefresh} className="text-sm font-bold text-yellow-600 hover:underline">
            Refresh Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Merchant Name</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Daily</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Weekly</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Monthly</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Yearly</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-gray-900">{m.username}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{m.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-emerald-600">
                    ₹{(m.revenue?.daily || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-gray-700">
                    ₹{(m.revenue?.weekly || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-gray-700">
                    ₹{(m.revenue?.monthly || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-gray-700">
                    ₹{(m.revenue?.yearly || 0).toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-right font-black text-gray-900">
                    ₹{(m.revenue?.overall || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MerchantStats;

// Re-using Lucide Icon for Key
function Key({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4.1a1 1 0 0 0-1.4 0l-2.1 2.1a1 1 0 0 0 0 1.4Z"/>
      <path d="m15.5 7.5-3 3"/>
      <path d="m21 2-9.6 9.6"/>
      <circle cx="7.5" cy="15.5" r="5.5"/>
    </svg>
  );
}
