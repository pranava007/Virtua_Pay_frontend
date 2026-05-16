import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { persistor } from "../redux/store";

import { LogOut, Settings, Package, Home, LogIn, UserPlus, ChevronLeft, History, LayoutDashboard, Banknote } from "lucide-react";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/login");
  };

  const isHome = location.pathname === "/";

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-6">
          {!isHome && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900 flex items-center gap-1"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-bold">Back</span>
            </button>
          )}

          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <span className="text-black font-black text-xl">V</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">
              VirtuaPay
            </h1>
          </Link>
        </div>

        <nav className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-yellow-600 transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>

          {user?.role === "admin" && (
            <Link to="/admin" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-yellow-600 transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin/payouts" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-yellow-600 transition-colors">
              <Banknote className="w-4 h-4" />
              Payouts
            </Link>
          )}

          {user && (
            <Link to="/history" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-yellow-600 transition-colors">
              <History className="w-4 h-4" />
              History
            </Link>
          )}

          {user && (
            <Link to="/settings" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-yellow-600 transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          )}

          <div className="h-4 w-[1px] bg-gray-200 mx-2" />

          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Logged in as</span>
                <span className="text-sm font-black text-gray-900">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-gray-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-bold rounded-xl transition-all shadow-lg shadow-yellow-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </div>
          )}
        </nav>

      </div>
    </header>
  );
};

export default Header;