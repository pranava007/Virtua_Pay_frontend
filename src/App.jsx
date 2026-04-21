import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboard from "./pages/AdminDashboard";
// import HistoryPage from "./pages/HistoryPage"; // ✅ add this
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Provider store={store}> {/* ✅ Redux */}
      <Router> {/* ✅ Router */}
        <Routes>

          {/* Common */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* USER */}
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/history" element={<HistoryPage />} /> */}
          <Route path="/pay" element={<PaymentPage />} />

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
      </Router>
    </Provider>
  );
}

export default App;