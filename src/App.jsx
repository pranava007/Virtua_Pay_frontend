import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import HomePage from "../src/pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
  <Routes>
  {/* Common */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* USER */}
  <Route path="/" element={<HomePage />} />
  <Route path="/history" element={<HistoryPage />} />

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
    path="/settings" 
    element={
      <ProtectedRoute roles={["admin"]}>
        <SettingsPage />
      </ProtectedRoute>
    } 
  />
</Routes>
  );
}

export default App;