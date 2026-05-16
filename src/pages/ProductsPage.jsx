import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, addProduct, removeProduct } from "../redux/slices/productSlice";
import { createOrder, verifyPayment } from "../services/api";
import { 
  ShoppingCart, 
  Package, 
  Loader2, 
  RefreshCw, 
  Plus, 
  Trash2, 
  X, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: products, loading } = useSelector((state) => state.products);
  const [processing, setProcessing] = useState(false);
  
  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form States
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Premium",
    image: ""
  });


  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await dispatch(addProduct(newProduct)).unwrap();
      toast.success("Product added to catalog");
      setShowAddModal(false);
      setNewProduct({ name: "", description: "", price: "", category: "Premium", image: "" });
    } catch (err) {
      toast.error(err || "Failed to add product");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    try {
      await dispatch(removeProduct(id)).unwrap();
      toast.success("Product removed");
    } catch (err) {
      toast.error(err || "Failed to delete product");
    }
  };


  const handlePurchase = async (product) => {
    setProcessing(true);
    try {
      const res = await createOrder({
        productId: product._id,
        customerName: user.username,
        email: user.email
      });

      const { payment, order } = res.data;

      // Razorpay Integration
      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        name: "Virtua Pay Store",
        description: `Purchase: ${product.name}`,
        order_id: payment.orderId,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verifyRes.data.success) {
              toast.success("Payment Successful! Order Confirmed.");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: user.username,
          email: user.email
        },
        theme: {
          color: "#EAB308"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to initiate purchase");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-yellow-500" />
        <p className="text-gray-500 font-medium">Fetching premium products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Our Collection</h1>
          <p className="text-gray-500 text-lg">Premium products curated for your digital experience.</p>
        </div>
        
        <div className="flex gap-4">
          {user?.role === "admin" && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-500/20"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}
          <button 
            onClick={() => dispatch(fetchProducts())}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-200 group"
          >
            <RefreshCw className="w-5 h-5 text-gray-400 group-hover:rotate-180 transition-all duration-500" />
          </button>
        </div>
      </div>

      {/* PRODUCT GRID */}
      {products.length === 0 ? (
        <div className="bg-gray-50 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-gray-200">
          <Package className="w-16 h-16 text-gray-200" />
          <h2 className="text-2xl font-bold text-gray-400">No products found</h2>
          <p className="text-gray-400">The catalog is currently empty. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product._id || product.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-yellow-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 flex flex-col h-full"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img 
                  src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {user?.role === "admin" && (
                  <button 
                    onClick={() => handleDeleteProduct(product._id)}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-red-500 hover:text-white backdrop-blur-md rounded-xl text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-gray-900 text-xl group-hover:text-yellow-600 transition-colors truncate pr-2">
                      {product.name}
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-900 text-white px-3 py-1 rounded-full">
                      {product.category || "Pro"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                    {product.description || "Experience premium quality with this meticulously crafted digital asset."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
                    <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                  </div>
                    <button 
                      onClick={() => handlePurchase(product)}
                      disabled={processing}
                      className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {processing ? <Loader2 className="animate-spin w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                      Buy Now
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-xl text-yellow-600">
                  <Plus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Add New Product</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-50 focus:border-yellow-500 transition-all"
                    placeholder="e.g. Ultra Gaming PC"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Price (INR)</label>
                  <input 
                    required
                    type="number" 
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-50 focus:border-yellow-500 transition-all"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-50 focus:border-yellow-500 transition-all"
                  placeholder="Tell us about this premium product..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-50 focus:border-yellow-500 transition-all"
                  >
                    <option>Premium</option>
                    <option>Digital</option>
                    <option>Software</option>
                    <option>Luxury</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400">Image URL (Optional)</label>
                  <input 
                    type="text" 
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-50 focus:border-yellow-500 transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-8 py-3 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={processing}
                  className="px-10 py-3 bg-gray-900 hover:bg-black text-white font-black text-sm uppercase rounded-2xl transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                >
                  {processing ? "Adding..." : "Confirm Addition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;