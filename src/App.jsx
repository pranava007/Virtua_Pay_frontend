import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
// import ProductsPage from "./pages/ProductsPage";
// import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { LayoutDashboard, History, Settings, CreditCard, Sun, Moon, LogOut, User as UserIcon, Package } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/slices/authSlice";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PaymentPage from "./pages/PaymentPage";



function AppContent() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

 

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
  dispatch(logout());
  navigate("/login");
};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Toaster position="top-center" reverseOrder={false} />
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-yellow-500 p-2 rounded-lg text-black">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 dark:from-white to-gray-500 dark:to-gray-400 bg-clip-text text-transparent">
                  VirtuaPay
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Products
              </Link>
              <Link to="/history" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                {user?.role === 'admin' ? (
                  <>
                    <Package className="w-4 h-4" /> Orders
                  </>
                ) : (
                  <>
                    <History className="w-4 h-4" /> History
                  </>
                )}
              </Link>
              {user && user.role === 'admin' && (
                <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all mr-2"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{user.username}</span>
                    <span className="text-[10px] text-gray-500">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-rose-500/10 hover:text-rose-500 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-bold bg-yellow-500 text-black hover:bg-yellow-400 shadow-sm transition-all active:scale-95">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* <Route path="/" element={<ProductsPage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

           <Route path="/pay" element={<PaymentPage />} />




          {/* <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute roles={["admin"]}>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />


        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default App;
