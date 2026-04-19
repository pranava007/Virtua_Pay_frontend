import { useState, useEffect } from "react";
import { getOrders } from "../services/api";
import { Clock, CheckCircle2, XCircle, AlertCircle, Package, Loader2, User } from "lucide-react";

const HistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await getOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin w-8 h-8 text-yellow-500" /></div>;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {isAdmin ? "Order Management" : "Purchase History"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {isAdmin ? "View and manage all customer transactions across the platform." : "Track and manage your past orders."}
                </p>
            </header>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                {isAdmin && <th className="px-6 py-4 font-medium">Customer</th>}
                                <th className="px-6 py-4 font-medium">Items</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? "6" : "5"} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                                        <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{order._id.slice(-8)}</td>
                                    {isAdmin && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                                    <User className="w-3 h-3 text-gray-500" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{order.customerId?.username || 'Guest'}</span>
                                                    <span className="text-[10px] text-gray-500">{order.customerId?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {order.items.map((item, idx) => (
                                                <span key={idx} className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name || 'Product'} × {item.quantity}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-yellow-600 dark:text-yellow-500">₹{order.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {order.status === 'paid' ? (
                                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 text-sm font-medium">
                                                <CheckCircle2 className="w-4 h-4" /> Paid
                                            </span>
                                        ) : order.status === 'pending' ? (
                                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-500 text-sm font-medium">
                                                <Clock className="w-4 h-4" /> Pending
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-500 text-sm font-medium">
                                                <XCircle className="w-4 h-4" /> Failed
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
