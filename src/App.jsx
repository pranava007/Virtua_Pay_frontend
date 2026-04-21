import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PaymentPage from "./pages/PaymentPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pay" element={<PaymentPage />} />

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