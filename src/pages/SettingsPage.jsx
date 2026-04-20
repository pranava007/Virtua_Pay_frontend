import { useState, useEffect } from "react";
import { getGatewayConfig, updateGatewayConfig } from "../services/api";
import { ShieldCheck, Zap, CreditCard, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const gatewayRes = await getGatewayConfig();
            setConfig(gatewayRes.data);
        } catch (err) {
            console.error("Failed to fetch configs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (gateway) => {
        if (saving) return;
        setSaving(true);
        try {
            const { data } = await updateGatewayConfig(gateway);
            setConfig(data);
            toast.success(`${gateway} activated!`);
        } catch (err) {
            toast.error("Failed to update gateway config");
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-yellow-500" />
            </div>
        );

    const gateways = [
        { id: "razorpay", name: "Razorpay", icon: <ShieldCheck className="w-6 h-6 text-yellow-500" /> },
        { id: "cashfree", name: "Cashfree", icon: <Zap className="w-6 h-6 text-amber-500" /> },
        { id: "payu", name: "PayU", icon: <CreditCard className="w-6 h-6 text-green-500" /> },
        { id: "phonepe", name: "PhonePe", icon: <Zap className="w-6 h-6 text-purple-500" /> }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Payment Settings</h1>

            {gateways.map((g) => (
                <div
                    key={g.id}
                    onClick={() => handleToggle(g.id)}
                    className={`p-4 border rounded cursor-pointer ${
                        config?.activeGateway === g.id
                            ? "border-yellow-500"
                            : "border-gray-300"
                    }`}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            {g.icon}
                            <span>{g.name}</span>
                        </div>
                        {config?.activeGateway === g.id && "✅"}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SettingsPage;