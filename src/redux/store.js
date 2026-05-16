import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage/index.js";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import configReducer from "./slices/configSlice";
import adminReducer from "./slices/adminSlice";

const storageEngine = storage.default || storage;

const persistConfig = {
  key: "root",
  version: 1,
  storage: storageEngine,
};

const appReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  orders: orderReducer,
  config: configReducer,
  admin: adminReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Clear persisted state from storage as well
    storageEngine.removeItem("persist:root");
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);