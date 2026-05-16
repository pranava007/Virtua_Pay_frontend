import { useState, useEffect } from "react";
import { 
  getPayoutMerchants, 
  updatePayoutConfig, 
  processPayout 
} from "../services/api";
import { 
  Wallet, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Percent,
  Banknote,
  Key,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

const PayoutsPage = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [payoutKeys, setPayoutKeys] = useState({ keyId: "", keySecret: "" });
  const [lastPayout, setLastPayout] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchMerchants = async () => {
    try {
      const { data } = await getPayoutMerchants();
      setMerchants(data);
    } catch (err) {
      toast.error("Failed to load payout data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const handleConfigUpdate = async () => {
    try {
      setProcessing(true);
      await updatePayoutConfig({ 
        merchantId: selectedMerchant._id, 
        razorpay: payoutKeys 
      });
      toast.success("Payout credentials updated");
      setShowConfigModal(false);
      fetchMerchants();
    } catch (err) {
      toast.error("Failed to update credentials");
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessPayout = async (merchant) => {
    if (!merchant.payoutConfig?.razorpay?.keyId) {
      toast.error("Please configure payout credentials first");
      return;
    }

    if (merchant.pendingGross <= 0) {
      toast.error("No pending balance for this merchant");
      return;
    }

    if (!window.confirm(`Process payout of ₹${merchant.netPayout.toLocaleString()} to ${merchant.username}?`)) return;

    try {
      setProcessing(true);
      const { data } = await processPayout({ 
        merchantId: merchant._id, 
        amount: merchant.pendingGross 
      });
      
      setLastPayout({
        ...data.payout,
        merchantName: merchant.username
      });
      setShowSuccessModal(true);
      fetchMerchants();
    } catch (err) {
      toast.error("Payout failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-yellow-500" />
        <p className="text-gray-500 font-medium">Loading merchant settlements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-yellow-600 font-bold uppercase tracking-widest text-sm">
          <Banknote className="w-5 h-5" />
          Payout Management
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Merchant Settlements</h1>
        <p className="text-gray-500 text-lg font-medium max-w-2xl">
          Review pending balances, manage payout credentials, and release funds to your merchants.
        </p>
      </header>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
          <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Platform Vol.</p>
            <h4 className="text-3xl font-black text-gray-900">
              ₹{merchants.reduce((acc, curr) => acc + curr.totalGross, 0).toLocaleString()}
            </h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Settled</p>
            <h4 className="text-3xl font-black text-gray-900">
              ₹{merchants.reduce((acc, curr) => acc + curr.totalPaid, 0).toLocaleString()}
            </h4>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Payouts</p>
            <h4 className="text-3xl font-black text-gray-900">
              ₹{merchants.reduce((acc, curr) => acc + curr.pendingGross, 0).toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* MERCHANTS LIST */}
      <div className="bg-white border border-gray-100 rounded-[3rem] shadow-2xl shadow-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-10 py-8">Merchant</th>
                <th className="px-10 py-8">Pending Balance</th>
                <th className="px-10 py-8 text-rose-500">Commission</th>
                <th className="px-10 py-8 text-emerald-600">Net Payout</th>
                <th className="px-10 py-8">Status</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {merchants.map((merchant) => (
                <tr key={merchant._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400">
                        {merchant.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-black text-gray-900">{merchant.username}</span>
                        <span className="text-xs text-gray-400 font-bold">{merchant.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="font-black text-gray-900">₹{merchant.pendingGross.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-rose-500">- ₹{merchant.commissionAmt.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="text-lg font-black text-emerald-600">₹{merchant.netPayout.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-8">
                    {merchant.payoutConfig?.razorpay?.keyId ? (
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl w-fit">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Setup Needed</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setSelectedMerchant(merchant);
                          setPayoutKeys(merchant.payoutConfig?.razorpay || { keyId: "", keySecret: "" });
                          setShowConfigModal(true);
                        }}
                        className="p-3 bg-gray-50 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-2xl transition-all"
                        title="Configure Payout Keys"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleProcessPayout(merchant)}
                        disabled={processing || merchant.pendingGross <= 0}
                        className={`flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-2xl transition-all shadow-lg ${merchant.pendingGross <= 0 ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                      >
                        Release Funds
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIG MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-white/60">
          <div className="bg-white w-full max-w-lg rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900">Payout Credentials</h3>
                  <p className="text-gray-400 font-medium">Configure payout account for {selectedMerchant?.username}</p>
                </div>
                <button 
                  onClick={() => setShowConfigModal(false)}
                  className="p-2 hover:bg-gray-50 rounded-xl text-gray-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-4">
                  <Key className="w-6 h-6 text-yellow-600 shrink-0" />
                  <p className="text-xs text-yellow-700 font-medium leading-relaxed">
                    Enter the Razorpay API credentials that will be used specifically for processing payouts to this merchant.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Razorpay Key ID</label>
                    <input
                      type="text"
                      value={payoutKeys.keyId}
                      onChange={(e) => setPayoutKeys({ ...payoutKeys, keyId: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-50 focus:border-yellow-500 transition-all"
                      placeholder="rzp_live_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Razorpay Secret</label>
                    <input
                      type="password"
                      value={payoutKeys.keySecret}
                      onChange={(e) => setPayoutKeys({ ...payoutKeys, keySecret: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-50 focus:border-yellow-500 transition-all"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfigUpdate}
                disabled={processing}
                className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-[1.5rem] shadow-xl shadow-yellow-500/20 transition-all"
              >
                {processing ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL / SETTLEMENT REPORT */}
      {showSuccessModal && lastPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-2xl bg-black/20">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-gray-100">
            <div className="bg-emerald-500 p-12 text-center text-white relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Settlement Released</h2>
                <p className="text-emerald-100 font-medium tracking-wide text-sm">TRANSACTION ID: #{lastPayout._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 blur-3xl rounded-full" />
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                  <span>Breakdown for {lastPayout.merchantName}</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="font-bold text-gray-500">Gross Amount</span>
                    <span className="font-black text-gray-900 text-lg">₹{lastPayout.grossAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-rose-50 rounded-2xl border border-rose-100">
                    <span className="font-bold text-rose-600">Platform Commission</span>
                    <span className="font-black text-rose-700 text-lg">- ₹{lastPayout.commissionAmount.toLocaleString()}</span>
                  </div>
                  <div className="h-[1px] bg-gray-100 mx-4" />
                  <div className="flex justify-between items-center p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                    <span className="font-black text-emerald-700">Net Settled</span>
                    <span className="font-black text-emerald-600 text-3xl">₹{lastPayout.netAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-gray-400" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                  This transaction has been recorded in the platform ledger. The funds have been released via the configured payout channel.
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-5 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl shadow-gray-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayoutsPage;
