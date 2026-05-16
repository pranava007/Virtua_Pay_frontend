import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { 
  ShieldCheck, 
  Loader2, 
  ShoppingBag, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [gateway, setGateway] = useState("");
  const [gatewayConfig, setGatewayConfig] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/api/v1/external/checkout/details/${orderId}`);
      if (data.success) {
        setOrder(data.order);
        setGateway(data.gateway);
        setGatewayConfig(data.gatewayConfig);
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load order details");
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setStatus("processing");
    try {
      const { data } = await api.post(`/api/v1/external/checkout/initiate/${orderId}`);
      const payment = data.payment;

      if (gateway === "razorpay") {
        const options = {
          key: gatewayConfig.razorpayKey,
          amount: payment.amount,
          currency: payment.currency,
          name: "Virtua Pay Checkout",
          description: `Order #${order.id.slice(-6)}`,
          order_id: payment.orderId,
          handler: async (response) => {
            verifyPayment(response);
          },
          theme: { color: "#EAB308" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } 
      else if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      }
    } catch (err) {
      setError("Failed to initiate payment");
      setStatus("error");
    }
  };

  const verifyPayment = async (paymentData) => {
    setStatus("processing");
    try {
      const { data } = await api.post(`/api/v1/external/checkout/verify/${orderId}`, {
        paymentData
      });

      if (data.success) {
        setStatus("success");
        setTimeout(() => {
          if (data.returnUrl) {
            window.location.href = data.returnUrl;
          } else {
            // Fallback if no return URL
            window.location.href = "/history";
          }
        }, 2000);
      }
    } catch (err) {
      setError("Payment verification failed");
      setStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-500 mx-auto" />
          <p className="text-gray-500 font-medium">Preparing your secure checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-red-50">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Error</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-yellow-500 p-8 text-black text-center relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 rounded-full bg-white blur-3xl"></div>
            </div>
            <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-black uppercase tracking-tight">Secure Checkout</h1>
            <p className="font-bold opacity-80 text-sm">Powered by Virtua Pay</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <ShoppingBag size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Order Summary</span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-sm font-bold text-gray-500">Total Amount</h3>
                  <p className="text-4xl font-black text-gray-900">₹{order.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase">Order ID</p>
                  <p className="text-sm font-mono font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {status === "processing" && (
              <div className="flex items-center justify-center gap-3 p-6 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-700">
                <Loader2 className="animate-spin" size={20} />
                <span className="font-bold">Processing your payment...</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center gap-4 p-8 bg-green-50 rounded-3xl border border-green-100 text-green-700 animate-in zoom-in duration-300">
                <CheckCircle2 size={48} className="text-green-500" />
                <div className="text-center">
                  <h3 className="text-xl font-bold">Payment Successful!</h3>
                  <p className="text-sm opacity-80">Redirecting you back to the merchant...</p>
                </div>
              </div>
            )}

            {/* Action Button */}
            {status !== "success" && status !== "processing" && (
              <button
                onClick={handlePayment}
                className="group relative w-full py-6 bg-gray-900 hover:bg-black text-white rounded-3xl font-black text-lg transition-all active:scale-[0.98] shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <CreditCard size={24} className="text-yellow-500" />
                PAY NOW WITH {gateway.toUpperCase()}
              </button>
            )}

            {/* Footer */}
            <div className="text-center space-y-4 pt-4">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase">
                <ShieldCheck size={14} className="text-green-500" />
                256-bit SSL Encrypted Secure Payment
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed max-w-[80%] mx-auto">
                By proceeding, you agree to Virtua Pay's Terms of Service and Privacy Policy. Your transaction is protected by industry-standard security protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
