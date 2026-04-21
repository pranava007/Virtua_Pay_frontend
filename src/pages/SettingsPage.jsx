import { useState, useEffect } from "react";
import { getGatewayConfig, updateGatewayConfig } from "../services/api";
import { ShieldCheck, Zap, CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const [config, setConfig] = useState(null);
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await getGatewayConfig();
      setConfig(res.data);
      setSelectedGateway(res.data.activeGateway); // 🔥 set initial selected
    } catch (err) {
      console.error("Failed to fetch configs", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SUBMIT FUNCTION
  const handleSubmit = async () => {
    if (!selectedGateway) {
      toast.error("Please select a gateway");
      return;
    }

    setSaving(true);
    try {
      const { data } = await updateGatewayConfig(selectedGateway);
      setConfig(data);
      toast.success(`${selectedGateway} activated!`);
    } catch (err) {
      toast.error("Failed to update gateway");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-yellow-500" />
      </div>
    );
  }

  const gateways = [
    {
      id: "razorpay",
      name: "Razorpay",
      icon: <ShieldCheck className="w-6 h-6 text-yellow-500" />,
    },
    {
      id: "cashfree",
      name: "Cashfree",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
    },
    {
      id: "payu",
      name: "PayU",
      icon: <CreditCard className="w-6 h-6 text-green-500" />,
    },
    {
      id: "phonepe",
      name: "PhonePe",
      icon: <Zap className="w-6 h-6 text-purple-500" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-4">
      <h1 className="text-2xl font-bold">Payment Settings</h1>

      {/* GATEWAY LIST */}
      {gateways.map((g) => (
        <div
          key={g.id}
          onClick={() => setSelectedGateway(g.id)}
          className={`p-4 border rounded-xl cursor-pointer transition-all ${
            selectedGateway === g.id
              ? "border-yellow-500 bg-yellow-50"
              : "border-gray-300"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              {g.icon}
              <span className="font-medium">{g.name}</span>
            </div>

            {selectedGateway === g.id && (
              <span className="text-green-600 font-bold">✅</span>
            )}
          </div>
        </div>
      ))}

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default SettingsPage;