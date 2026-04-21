import { Link } from "react-router-dom";
import { Settings, CreditCard, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard 👑
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your payment system and monitor transactions.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border shadow-sm">
          <h2 className="text-sm text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border shadow-sm">
          <h2 className="text-sm text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold mt-2">₹ --</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border shadow-sm">
          <h2 className="text-sm text-gray-500">Active Gateway</h2>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>

      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Link
          to="/settings"
          className="flex items-center gap-4 p-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl transition-all shadow-md"
        >
          <Settings className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">Gateway Settings</h3>
            <p className="text-sm">Manage payment gateways</p>
          </div>
        </Link>

        <Link
          to="/history"
          className="flex items-center gap-4 p-6 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-2xl transition-all shadow-md"
        >
          <CreditCard className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-lg">View Orders</h3>
            <p className="text-sm">Check all transactions</p>
          </div>
        </Link>

      </div>

      {/* ANALYTICS PLACEHOLDER */}
      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-yellow-500" />
          <h2 className="font-bold text-lg">Analytics (Coming Soon)</h2>
        </div>
        <p className="text-gray-500 text-sm">
          Graphs and reports will be displayed here.
        </p>
      </div>

    </div>
  );
};

export default AdminDashboard;