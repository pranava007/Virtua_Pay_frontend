import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";


import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import SettingsPage from "./pages/SettingsPage";
import ProductsPage from "./pages/ProductsPage";
import AdminDashboard from "./pages/AdminDashboard";
import PayoutsPage from "./pages/PayoutsPage";
import HistoryPage from "./pages/HistoryPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>

        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
          <Header />
          <main className="flex-grow">
            <Routes>

          {/* Common */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* USER */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/checkout/:orderId" element={<CheckoutPage />} />

          {/* ADMIN */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/payouts" 
            element={
              <ProtectedRoute roles={["admin"]}>
                <PayoutsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute roles={["admin", "user"]}>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />

          </Routes>
          </main>
          <Footer />
        </div>
        </Router>
      </PersistGate>
    </Provider>

  );
}

export default App;