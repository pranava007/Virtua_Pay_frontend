import { useState, useEffect } from "react";
import { getGatewayConfig, updateGatewayConfig, getExternalConfig, updateExternalConfig } from "../services/api";
import { ShieldCheck, Zap, CreditCard, Save, Loader2, Globe, Link2 } from "lucide-react";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
    const [config, setConfig] = useState(null);
    const [extConfig, setExtConfig] = useState({ baseUrl: "", apiKey: "", isActive: false });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const [gatewayRes, extRes] = await Promise.all([
                getGatewayConfig(),
                getExternalConfig()
            ]);
            setConfig(gatewayRes.data);
            setExtConfig(extRes.data);
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
            toast.success(`${gateway.charAt(0).toUpperCase() + gateway.slice(1)} gateway activated!`);
        } catch (err) {
            toast.error("Failed to update gateway config");
        } finally {
            setSaving(false);
        }
    };

    const handleExtChange = (e) => {
        const { name, value, type, checked } = e.target;
        setExtConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveExt = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data } = await updateExternalConfig(extConfig);
            setExtConfig(data);
            toast.success("External API configuration saved!");
        } catch (err) {
            toast.error("Failed to update external config: " + (err.response?.data?.error || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-yellow-500" /></div>;

    const gateways = [
        { id: "razorpay", name: "Razorpay", description: "Accept payments via credit/debit cards, UPI, and wallets.", icon: <ShieldCheck className="w-6 h-6 text-yellow-500" /> },
        { id: "cashfree", name: "Cashfree", description: "Next-gen payment gateway for high growth businesses.", icon: <Zap className="w-6 h-6 text-amber-500" /> },
        { id: "payu", name: "PayU", description: "Leading payment service provider in India.", icon: <CreditCard className="w-6 h-6 text-green-500" /> },
        { id: "phonepe", name: "PhonePe", description: "Safe and secure payments with PhonePe.", icon: <Zap className="w-6 h-6 text-purple-500" /> }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payments Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your active payment gateways and configurations.</p>
            </header>

            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-xl font-bold">Payment Gateways</h2>
                </div>
                <div className="space-y-4">
                    {gateways.map((g) => (
                        <div
                            key={g.id}
                            onClick={() => handleToggle(g.id)}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${config?.activeGateway === g.id
                                ? "bg-yellow-500/5 dark:bg-yellow-500/5 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.1)]"
                                : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${config?.activeGateway === g.id ? 'bg-yellow-500/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                        {g.icon}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{g.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">{g.description}</p>
                                    </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${config?.activeGateway === g.id ? "border-yellow-500 bg-yellow-500" : "border-gray-300 dark:border-gray-700"
                                    }`}>
                                    {config?.activeGateway === g.id && <div className="w-2 h-2 rounded-full bg-black transition-all scale-100" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-xl font-bold">External API Integration</h2>
                </div>
                
                <form onSubmit={handleSaveExt} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                    <div className="flex items-center justify-between p-4 bg-yellow-500/5 rounded-2xl border border-yellow-500/20">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Enable External Product API</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Fetch products dynamically from a third-party server.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="isActive"
                                checked={extConfig.isActive} 
                                onChange={handleExtChange}
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-500"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">API Base URL</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Link2 className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="url"
                                    name="baseUrl"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                    placeholder="http://localhost:8000"
                                    value={extConfig.baseUrl}
                                    onChange={handleExtChange}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">API Key (Optional)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="apiKey"
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    value={extConfig.apiKey}
                                    onChange={handleExtChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                            Save Configuration
                        </button>
                    </div>
                </form>
            </section>

            {saving && (
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-500 justify-center animate-pulse">
                    <Save className="w-4 h-4" /> Updating settings...
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
