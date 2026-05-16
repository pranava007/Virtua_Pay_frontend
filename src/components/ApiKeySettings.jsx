import { useState, useEffect } from "react";
import { Copy, RefreshCw, Key, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../services/api";
import { toast } from "react-hot-toast";

const ApiKeySettings = () => {
  const { user } = useSelector((state) => state.auth);
  const [apiKey, setApiKey] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (user?.role === "user") {
      fetchApiKey();
      setWebsiteUrl(user?.websiteUrl || "");
    } else {
      setLoading(false);
    }
  }, [user]);

  if (user?.role !== "user") return null;

  const fetchApiKey = async () => {
    try {
      const res = await api.get("/auth/api-key");
      setApiKey(res.data.apiKey);
    } catch (err) {
      toast.error("Failed to load API key");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUrl = async () => {
    if (!websiteUrl) return toast.error("Please enter a valid URL");
    setSavingUrl(true);
    try {
      await api.post("/auth/update-website", { websiteUrl });
      toast.success("Redirect URL updated successfully!");
    } catch (err) {
      toast.error("Failed to update redirect URL");
    } finally {
      setSavingUrl(false);
    }
  };

  const generateNewKey = async () => {
    if (!window.confirm("Generating a new key will invalidate your current one. Continue?")) return;
    
    setGenerating(true);
    try {
      const res = await api.post("/auth/api-key/generate");
      setApiKey(res.data.apiKey);
      toast.success("New API key generated successfully!");
      setShowKey(true);
    } catch (err) {
      toast.error("Failed to generate API key");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard!");
  };

  if (loading) return <div className="animate-pulse h-20 bg-gray-100 rounded-2xl" />;

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
            <Key className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Merchant API Key</h3>
            <p className="text-sm text-gray-500">Use this key to integrate VirtuaPay into your external website.</p>
          </div>
        </div>
        <button
          onClick={generateNewKey}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
          {apiKey ? "Regenerate Key" : "Generate Key"}
        </button>
      </div>

      {apiKey ? (
        <div className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <input
              type={showKey ? "text" : "password"}
              readOnly
              value={apiKey}
              className="w-full pl-12 pr-24 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-mono text-sm text-gray-600 focus:outline-none"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-all text-gray-400"
                title={showKey ? "Hide Key" : "Show Key"}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-200 rounded-lg transition-all text-gray-400"
                title="Copy Key"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <div className="text-amber-600 font-bold text-lg">!</div>
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
              Keep your API key secret. Do not share it or include it in client-side code. 
              Include it in the <code className="bg-amber-100 px-1 rounded">x-api-key</code> header of your server-to-server requests.
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">Default Redirect URL</h4>
              <p className="text-xs text-gray-500 mb-4">Your users will be redirected back to this URL after a successful payment.</p>
              
              <div className="flex gap-3">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://your-website.com/success"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSaveUrl}
                  disabled={savingUrl}
                  className="px-6 py-3 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {savingUrl ? "Saving..." : "Save URL"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No API key generated yet.</p>
        </div>
      )}
    </div>
  );
};

export default ApiKeySettings;
