import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchGatewayConfig, 
  fetchMerchants,
  saveGatewayConfig
} from "../redux/slices/configSlice";
import { 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Loader2, 
  Globe, 
  Key, 
  CheckCircle2, 
  UserCheck,
  FlaskConical,
  TrendingUp,
  Percent
} from "lucide-react";
import { toast } from "react-hot-toast";
import ApiKeySettings from "../components/ApiKeySettings";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { gateway: gatewayConfig, external: externalConfigRedux, merchants = [], loading } = useSelector((state) => state.config);
  
  const [commissionPercentage, setCommissionPercentage] = useState(5);
  const [selectedGateway, setSelectedGateway] = useState("");
  const [testingMerchantId, setTestingMerchantId] = useState("");
  const [saving, setSaving] = useState(false);
  const [editGateway, setEditGateway] = useState(null);

  // Form states for gateway keys
  const [gatewayKeys, setGatewayKeys] = useState({
    razorpay: { keyId: "", keySecret: "" },
    cashfree: { appId: "", secret: "" },
    payu: { merchantKey: "", merchantSalt: "" },
    phonepe: { merchantId: "", saltKey: "", saltIndex: "" }
  });

  useEffect(() => {
    dispatch(fetchGatewayConfig());
    if (user?.role === "admin") {
      dispatch(fetchMerchants());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (gatewayConfig) {
      setSelectedGateway(gatewayConfig.activeGateway);
      setTestingMerchantId(gatewayConfig.testingMerchantId || "");
      if (gatewayConfig.commissionPercentage !== undefined) setCommissionPercentage(gatewayConfig.commissionPercentage);
      if (gatewayConfig.razorpay) setGatewayKeys(prev => ({ ...prev, razorpay: gatewayConfig.razorpay }));
      if (gatewayConfig.cashfree) setGatewayKeys(prev => ({ ...prev, cashfree: gatewayConfig.cashfree }));
      if (gatewayConfig.payu) setGatewayKeys(prev => ({ ...prev, payu: gatewayConfig.payu }));
      if (gatewayConfig.phonepe) setGatewayKeys(prev => ({ ...prev, phonepe: gatewayConfig.phonepe }));
    }
  }, [gatewayConfig]);


  const handleGatewaySelect = async (gatewayId) => {
    if (gatewayId === selectedGateway) return;
    
    setSelectedGateway(gatewayId);
    try {
      await dispatch(saveGatewayConfig({ activeGateway: gatewayId })).unwrap();
      toast.success(`${gatewayId.charAt(0).toUpperCase() + gatewayId.slice(1)} activated`);
    } catch (err) {
      toast.error(err || "Failed to update active gateway");
      setSelectedGateway(gatewayConfig.activeGateway);
    }
  };

  const handleGatewayKeyUpdate = async () => {
    setSaving(true);
    try {
      const updateData = { [editGateway]: gatewayKeys[editGateway] };
      await dispatch(saveGatewayConfig(updateData)).unwrap();
      toast.success("Gateway credentials updated");
      setEditGateway(null);
    } catch (err) {
      toast.error(err || "Failed to update credentials");
    } finally {
      setSaving(false);
    }
  };

  const handleCommissionUpdate = async () => {
    setSaving(true);
    try {
      await dispatch(saveGatewayConfig({ commissionPercentage })).unwrap();
      toast.success(`Default commission set to ${commissionPercentage}%`);
    } catch (err) {
      toast.error(err || "Failed to update commission");
    } finally {
      setSaving(false);
    }
  };

  const handleTestingUserUpdate = async (merchantId) => {
    setTestingMerchantId(merchantId);
    try {
      await dispatch(saveGatewayConfig({ testingMerchantId: merchantId })).unwrap();
      toast.success("Testing Product User updated");
    } catch (err) {
      toast.error(err || "Failed to update testing user");
      setTestingMerchantId(gatewayConfig.testingMerchantId || "");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-yellow-500" />
        <p className="text-gray-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  const gateways = [
    {
      id: "razorpay",
      name: "Razorpay",
      desc: "Accept payments via credit/debit cards, UPI, and wallets.",
      icon: <ShieldCheck className="w-6 h-6 text-yellow-500" />,
    },
    {
      id: "cashfree",
      name: "Cashfree",
      desc: "Next-gen payment gateway for high growth businesses.",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
    },
    {
      id: "payu",
      name: "PayU",
      desc: "Leading payment service provider in India.",
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
    },
    {
      id: "phonepe",
      name: "PhonePe",
      desc: "Safe and secure payments with PhonePe.",
      icon: <Zap className="w-6 h-6 text-purple-500" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Merchant Settings</h1>
        <p className="text-gray-500 text-lg">Manage your API credentials, payment infrastructure and external integrations.</p>
      </div>

      {/* API KEY SECTION - USER ONLY */}
      {user?.role === "user" && <ApiKeySettings />}

      {/* GLOBAL GATEWAY INFO - ADMIN ONLY */}
      {user?.role === "admin" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-yellow-600 font-semibold text-lg">
            <FlaskConical className="w-5 h-5" />
            <h2>SaaS Gateway Status</h2>
          </div>
          
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 space-y-6 shadow-sm">
            <div className="flex items-start gap-3 p-4 bg-yellow-50/30 rounded-xl border border-yellow-100/50">
              <UserCheck className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-gray-900">Unified Platform Gateway Active</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The platform is currently operating in <span className="font-bold text-yellow-700">Global SaaS Mode</span>. All merchants using API keys will automatically use the <span className="font-bold text-gray-700">active gateway</span> selected below. Individual merchant gateway settings are bypassed.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PAYMENT GATEWAYS SECTION - ADMIN ONLY */}
      {user?.role === "admin" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-yellow-600 font-semibold text-lg">
            <CreditCard className="w-5 h-5" />
            <h2>Payment Gateways</h2>
          </div>

        <div className="grid gap-4">
          {gateways.map((g) => (
            <div
              key={g.id}
              className={`group relative overflow-hidden bg-white border-2 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg ${
                selectedGateway === g.id
                  ? "border-yellow-500 ring-4 ring-yellow-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div 
                  className="flex flex-1 items-center gap-4 cursor-pointer"
                  onClick={() => handleGatewaySelect(g.id)}
                >
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                    {g.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{g.name}</h3>
                    <p className="text-gray-500 text-sm">{g.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setEditGateway(g.id)}
                    className="text-xs font-semibold text-gray-400 hover:text-yellow-600 underline"
                  >
                    Configure Keys
                  </button>
                  <div 
                    onClick={() => handleGatewaySelect(g.id)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      selectedGateway === g.id 
                        ? "border-yellow-500 bg-yellow-500" 
                        : "border-gray-200"
                    }`}
                  >
                    {selectedGateway === g.id && <CheckCircle2 className="w-5 h-5 text-white" />}
                  </div>
                </div>
              </div>

              {/* KEYS EDITOR (INLINE) */}
              {editGateway === g.id && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <h4 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Configure {g.name} Credentials
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.keys(gatewayKeys[g.id]).map((key) => (
                      <div key={key} className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type="password"
                          value={gatewayKeys[g.id][key] || ""}
                          onChange={(e) => setGatewayKeys({
                            ...gatewayKeys,
                            [g.id]: { ...gatewayKeys[g.id], [key]: e.target.value }
                          })}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-all"
                          placeholder={`Enter ${key}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      onClick={() => setEditGateway(null)}
                      className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleGatewayKeyUpdate}
                      disabled={saving}
                      className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold rounded-lg transition-all"
                    >
                      {saving ? "Saving..." : "Update Credentials"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      )}

      {/* PLATFORM COMMISSION SECTION - ADMIN ONLY */}
      {user?.role === "admin" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-yellow-600 font-semibold text-lg">
            <TrendingUp className="w-5 h-5" />
            <h2>Platform Commission Settings</h2>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-yellow-50/30 p-6 rounded-2xl border border-yellow-100/50">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900">Default Commission Percentage</h3>
                  <p className="text-sm text-gray-500">The percentage deducted from every transaction before merchant payout.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      value={commissionPercentage}
                      onChange={(e) => setCommissionPercentage(e.target.value)}
                      className="w-24 px-4 py-3 bg-white border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 font-black text-center text-lg"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                  </div>
                  <button
                    onClick={handleCommissionUpdate}
                    disabled={saving}
                    className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
                  >
                    {saving ? "Updating..." : "Set Commission"}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center gap-2">
              <Percent className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-400 font-medium">This percentage is used to calculate net merchant payouts at the end of the day.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SettingsPage;