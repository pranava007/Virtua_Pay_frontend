import axios from "axios";
import { store } from "../redux/store";

// const API_URL = "https://virtua-pay-backend.onrender.com/";
const API_URL = "https://deve.virtuapayments.com/api";

const api = axios.create({
  baseURL: API_URL
});

// 🔐 JWT Token attach
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

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


// ================= ADMIN (CONFIG) =================
export const getGatewayConfig = () =>
  api.get("/admin/config");

export const updateGatewayConfig = (configData) =>
  api.patch("/admin/config", configData);

export const getExternalConfig = () =>
  api.get("/admin/external-config");

export const updateExternalConfig = (configData) =>
  api.patch("/admin/external-config", configData);

export const getMerchantStats = () =>
  api.get("/admin/merchant-stats");

// ================= PAYMENT =================

// 🔥 CREATE PAYMENT (IMPORTANT)
export const createPayment = (orderId) =>
  api.post("/payment/create-payment", { orderId });

// 🔥 VERIFY PAYMENT
export const verifyPayment = (data) =>
  api.post("/payment/verify-payment", data);


// ================= PRODUCTS =================
export const getProducts = () =>
  api.get("/products");

export const createProduct = (productData) =>
  api.post("/products", productData);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

// ================= ORDERS =================
export const createOrder = (orderData) =>
  api.post("/orders", orderData);

export const getMyOrders = () =>
  api.get("/orders/my-orders");

// ================= PAYOUTS =================
export const getPayoutMerchants = () =>
  api.get("/payouts/merchants");

export const updatePayoutConfig = (payoutData) =>
  api.post("/payouts/config", payoutData);

export const processPayout = (payoutData) =>
  api.post("/payouts/process", payoutData);

export default api;
