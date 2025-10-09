import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../Utlis/baseURL";

// Axios instance setup
const API = axios.create({
  baseURL: `${baseURL}/orgs`,
});

// Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Fetch Organization Info
export const fetchOrg = createAsyncThunk(
  "org/fetchOrg",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/${id}`);
      return res.data.organization;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch organization"
      );
    }
  }
);

// Update Active/Maintenance Status
export const updateOrgStatus = createAsyncThunk(
  "org/updateStatus",
  async ({ id, active, maintenanceMode }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/${id}/status`, { active, maintenanceMode });
      return res.data.organization;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// Update Organization Details (name/address)
export const updateOrg = createAsyncThunk(
  "org/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await API.patch(`/${id}/update`, formData);
      return res.data.organization;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update organization"
      );
    }
  }
);

// Delete Organization
export const deleteOrg = createAsyncThunk(
  "org/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.delete(`/${id}/delete`);
      return res.data.organization;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete organization"
      );
    }
  }
);

// Slice
const orgSlice = createSlice({
  name: "org",
  initialState: {
    org: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearOrgMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetOrg: (state) => {
      state.org = null;
      state.error = null;
      state.successMessage = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.org = action.payload;
      })
      .addCase(fetchOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Status
      .addCase(updateOrgStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrgStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.org = action.payload;
        state.successMessage = "Organization status updated successfully";
      })
      .addCase(updateOrgStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Full Update
      .addCase(updateOrg.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.org = action.payload;
        state.successMessage = "Organization updated successfully";
      })
      .addCase(updateOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteOrg.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrg.fulfilled, (state) => {
        state.loading = false;
        state.org = null;
        state.successMessage = "Organization deleted successfully";
      })
      .addCase(deleteOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrgMessages, resetOrg } = orgSlice.actions;
export default orgSlice.reducer;
