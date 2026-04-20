import axios from "axios";

const API_URL = "https://virtua-pay-backend.onrender.com/";

const api = axios.create({
  baseURL: API_URL
});

// 🔐 JWT Token attach
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// ================= AUTH =================
export const register = (userData) =>
  api.post("/auth/register", userData);

export const login = (userData) =>
  api.post("/auth/login", userData);

export const getMe = () =>
  api.get("/auth/me");


// ================= ADMIN (GATEWAY CONFIG) =================
export const getGatewayConfig = () =>
  api.get("/payment/config");

export const updateGatewayConfig = (activeGateway) =>
  api.patch("/payment/config", { activeGateway });


// ================= PAYMENT =================

// 🔥 CREATE PAYMENT (IMPORTANT)
export const createPayment = (orderId) =>
  api.post("/payment/create-payment", { orderId });

// 🔥 VERIFY PAYMENT
export const verifyPayment = (data) =>
  api.post("/payment/verify-payment", data);


export default api;