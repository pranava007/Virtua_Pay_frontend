import axios from "axios";

const API_URL = "http://localhost:7000/api";

const api = axios.create({
    baseURL: API_URL
});

// Add a request interceptor to inject JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const register = (userData) => api.post("/auth/register", userData);
export const login = (userData) => api.post("/auth/login", userData);
export const getMe = () => api.get("/auth/me");

export const getProducts = () => api.get("/payment/products");
export const getOrders = () => api.get("/payment/orders");
export const getGatewayConfig = () => api.get("/payment/config");
export const updateGatewayConfig = (activeGateway) => api.patch("/payment/config", { activeGateway });
export const getExternalConfig = () => api.get("/payment/external-config");
export const updateExternalConfig = (config) => api.patch("/payment/external-config", config);
export const createOrder = (items, customerId) => api.post("/payment/create-order", { items, customerId });
export const verifyPayment = (paymentData) => api.post("/payment/verify-payment", paymentData);

export default api;
