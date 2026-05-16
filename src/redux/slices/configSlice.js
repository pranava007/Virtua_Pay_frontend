import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getGatewayConfig, 
  updateGatewayConfig, 
  getMerchantStats
} from "../../services/api";

export const fetchGatewayConfig = createAsyncThunk(
  "config/fetchGateway",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGatewayConfig();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch gateway config");
    }
  }
);

export const fetchMerchants = createAsyncThunk(
  "config/fetchMerchants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMerchantStats();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch merchants");
    }
  }
);


export const saveGatewayConfig = createAsyncThunk(
  "config/saveGateway",
  async (configData, { rejectWithValue, dispatch }) => {
    try {
      const response = await updateGatewayConfig(configData);
      dispatch(fetchGatewayConfig());
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update gateway config");
    }
  }
);


const configSlice = createSlice({
  name: "config",
  initialState: {
    gateway: null,
    merchants: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGatewayConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGatewayConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.gateway = action.payload;
      })
      .addCase(fetchGatewayConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMerchants.fulfilled, (state, action) => {
        state.merchants = action.payload;
      });
  },
});

export default configSlice.reducer;
