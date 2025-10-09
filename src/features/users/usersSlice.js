// src/features/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../Utlis/baseURL";

const API = axios.create({ baseURL: `${baseURL}/users` });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Thunks
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/");
      return data.users;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const addSubUser = createAsyncThunk(
  "users/addSubUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/add-sub-user", formData);
      return data.subUser;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add sub user");
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "users/updateUserStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/${id}/status`, { status });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

export const updateSubUser = createAsyncThunk(
  "users/updateSubUser",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.patch(`/sub-user/${id}`, formData);
      return data.subUser;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update sub user");
    }
  }
);

export const deleteSubUser = createAsyncThunk(
  "users/deleteSubUser",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/sub-user/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete sub user");
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getUsers
      .addCase(getUsers.pending, (state) => { state.loading = true; })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // addSubUser
      .addCase(addSubUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.successMessage = "Sub-user added successfully";
      })
      .addCase(addSubUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // updateUserStatus
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
        state.successMessage = "User status updated";
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload;
      })

      // updateSubUser
      .addCase(updateSubUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
        state.successMessage = "Sub-user updated";
      })
      .addCase(updateSubUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // deleteSubUser
      .addCase(deleteSubUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.successMessage = "Sub-user deleted";
      })
      .addCase(deleteSubUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = userSlice.actions;
export default userSlice.reducer;
