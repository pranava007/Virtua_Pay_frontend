import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice";
import { Clock, CheckCircle2, XCircle, Package, Loader2, TrendingUp } from "lucide-react";
import MerchantStats from "../components/MerchantStats";

const HistoryPage = () => {
    const dispatch = useDispatch();
    const { items: orders, loading } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-yellow-500" /></div>;

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-8">
            <header>
                <h1 className="text-3xl font-black text-gray-900">
                    {isAdmin ? "Platform Revenue Monitoring" : "Order History"}
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                    {isAdmin ? "Consolidated revenue insights across all platform merchants." : "Review your store's sales and payment performance."}
                </p>
            </header>

            {isAdmin ? (
                <MerchantStats />
            ) : (
                <>
                    {/* STATS CARDS (FOR MERCHANTS) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Store Revenue</p>
                                <h4 className="text-3xl font-black text-gray-900">
                                    ₹{(orders || []).filter(o => o && (o.status === 'completed' || o.status === 'paid')).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toLocaleString()}
                                </h4>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                                <Package className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Store Orders</p>
                                <h4 className="text-3xl font-black text-gray-900">
                                    {(orders || []).filter(o => o && (o.status === 'completed' || o.status === 'paid')).length}
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-100/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                                        <th className="px-8 py-6">Order Reference</th>
                                        <th className="px-8 py-6">Customer</th>
                                        <th className="px-8 py-6">Product Details</th>
                                        <th className="px-8 py-6 text-right">Revenue</th>
                                        <th className="px-8 py-6">Payment Status</th>
                                        <th className="px-8 py-6">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center text-gray-400">
                                                <Package className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                                <p className="font-bold">No transactions found in this period.</p>
                                            </td>
                                        </tr>
                                    )}
                                    {orders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <span className="font-mono text-xs text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded-lg">#{order._id.slice(-10).toUpperCase()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-gray-900">{order.customerName || 'Anonymous'}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{order.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    {(order.items || []).map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-gray-800">{item.name}</span>
                                                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-black">×{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="font-black text-gray-900">₹{(order.amount || 0).toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                {order.status === 'completed' || order.status === 'paid' ? (
                                                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span className="text-xs font-black uppercase">Success</span>
                                                    </div>
                                                ) : order.status === 'pending' ? (
                                                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl w-fit">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="text-xs font-black uppercase">Pending</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl w-fit">
                                                        <XCircle className="w-4 h-4" />
                                                        <span className="text-xs font-black uppercase">Failed</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-gray-900 uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HistoryPage;
