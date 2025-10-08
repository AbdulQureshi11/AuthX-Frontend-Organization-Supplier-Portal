// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../Utlis/baseURL";

// 🔹 Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, // ✅ restore saved user
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// 🔹 Login thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseURL}/auth/login`, credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// 🔹 Register thunk
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${baseURL}/auth/register`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

// 🔹 Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ restore user + token manually (for refresh)
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // ✅ logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    // 🔹 Login cases
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;

      // ✅ Save both user & token
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // 🔹 Register cases
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      // ✅ Registration success only, user must login separately
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
