import { useState, useEffect } from "react";
import { getProducts, createOrder, verifyPayment } from "../services/api";
import { ShoppingCart, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setError("");
        try {
            const { data } = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
            setError(err.response?.data?.error || "Unable to load products. Please check external API configuration.");
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (product) => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            toast.error("Please login to make a purchase");
            window.location.href = "/login";
            return;
        }

        const user = JSON.parse(userStr);
        setPurchasing(product._id);
        const processingToast = toast.loading("Preparing your order...");
        
        try {
            const { data } = await createOrder([{ productId: product._id, quantity: 1 }], user._id);
            toast.dismiss(processingToast);
            if (data.success) {
                if (data.payment.type === "razorpay") {
                    const options = {
                        key: data.payment.key,
                        amount: product.price * 100,
                        currency: "INR",
                        name: "Virtua Pay",
                        description: `Purchase ${product.name}`,
                        order_id: data.payment.orderId,
                        handler: async (response) => {
                            try {
                                await verifyPayment({
                                    orderId: data.orderId,
                                    paymentId: response.razorpay_payment_id,
                                    status: "paid"
                                });
                                toast.success("Payment Successful!");
                                window.location.href = "/history";
                            } catch (err) {
                                toast.error("Verification failed: " + err.message);
                            }
                        },
                        prefill: {
                            name: user.username,
                            email: user.email,
                            contact: ""
                        },
                        theme: {
                            color: "#eab308"
                        }
                    };
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                } else if (data.payment.type === "payu") {
                    const form = document.createElement("form");
                    form.method = "POST";
                    form.action = data.payment.url;

                    Object.entries(data.payment.params).forEach(([key, value]) => {
                        const input = document.createElement("input");
                        input.type = "hidden";
                        input.name = key;
                        input.value = value;
                        form.appendChild(input);
                    });

                    document.body.appendChild(form);
                    form.submit();
                } else if (data.payment.type === "redirect") {
                    window.location.href = data.payment.url;
                }
            }
        } catch (err) {
            toast.dismiss();
            const errorMsg = err.response?.data?.error || err.message;
            toast.error("Purchase failed: " + errorMsg);
        } finally {
            setPurchasing(null);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-yellow-500" /></div>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Premium gadgets for your digital lifestyle.</p>
            </header>

            {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-6 rounded-3xl text-center space-y-4">
                    <p className="font-medium">{error}</p>
                    <button 
                        onClick={fetchProducts}
                        className="text-sm font-bold bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600 transition-colors"
                    >
                        Retry Fetching
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all group shadow-sm hover:shadow-md">
                        <div className="h-48 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => { e.target.src = ""; e.target.onerror = null; }} // Handle broken images
                                />
                            ) : (
                                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">📱</span>
                            )}
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{product.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                                {user?.role !== 'admin' && (
                                    <button
                                        onClick={() => handlePurchase(product)}
                                        disabled={purchasing === product._id}
                                        className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                                    >
                                        {purchasing === product._id ? <Loader2 className="animate-spin w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                                        Buy Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
