import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../Utlis/baseURL";

// Axios instance with token
const API = axios.create({
  baseURL: `${baseURL}/suppliers`,
});
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Fetch all suppliers
export const fetchSuppliers = createAsyncThunk(
  "supplier/fetchSuppliers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/get");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch suppliers");
    }
  }
);

// Fetch single supplier
export const fetchSupplierById = createAsyncThunk(
  "supplier/fetchSupplierById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch supplier");
    }
  }
);

// Create supplier
export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await API.post("/add", formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create supplier");
    }
  }
);

// Update supplier
export const updateSupplier = createAsyncThunk(
  "supplier/updateSupplier",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/${id}`, formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update supplier");
    }
  }
);

// Delete supplier
export const deleteSupplier = createAsyncThunk(
  "supplier/deleteSupplier",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete supplier");
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    suppliers: [],
    currentSupplier: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSupplierMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch one
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.currentSupplier = action.payload;
      })

      // Create
      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers.unshift(action.payload);
        state.successMessage = "Supplier added successfully";
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.suppliers.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.suppliers[index] = action.payload;
        state.successMessage = "Supplier updated successfully";
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.filter((s) => s._id !== action.payload);
        state.successMessage = "Supplier deleted successfully";
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSupplierMessages } = supplierSlice.actions;
export default supplierSlice.reducer;
