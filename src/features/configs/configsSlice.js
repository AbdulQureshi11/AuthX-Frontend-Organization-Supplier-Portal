import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../Utlis/baseURL";

// Axios instance
const API = axios.create({ baseURL: `${baseURL}/config` });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Fetch all configs
export const fetchConfigs = createAsyncThunk(
  "config/fetchConfigs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/get");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load configs");
    }
  }
);

// Create config (main only)
export const createConfig = createAsyncThunk(
  "config/createConfig",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/create", formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create config");
    }
  }
);

// Search configs
export const searchConfigs = createAsyncThunk(
  "config/searchConfigs",
  async (query, { rejectWithValue }) => {
    try {
      const res = await API.get(`/search/q?q=${encodeURIComponent(query)}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

// Update config
export const updateConfig = createAsyncThunk(
  "config/updateConfig",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/update/${id}`, formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update config");
    }
  }
);

const configSlice = createSlice({
  name: "config",
  initialState: {
    configs: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearConfigMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.configs = action.payload;
      })
      .addCase(fetchConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(createConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "API Config created successfully";
        state.configs.push(action.payload);
      })
      .addCase(createConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search
      .addCase(searchConfigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.configs = action.payload;
      })
      .addCase(searchConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Configuration updated successfully";
        state.configs = state.configs.map((c) =>
          c._id === action.payload._id ? action.payload : c
        );
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearConfigMessages } = configSlice.actions;
export default configSlice.reducer;
