import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../Utlis/baseURL";

// Axios setup
const API = axios.create({ baseURL: `${baseURL}/search` });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Async thunk for global search
export const performSearch = createAsyncThunk(
  "search/performSearch",
  async (query, { rejectWithValue }) => {
    try {
      const res = await API.get(`/?q=${encodeURIComponent(query)}`);
      if (!res.data?.success)
        return rejectWithValue(res.data?.message || "Search failed");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Search failed");
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    loading: false,
    error: null,
    results: { users: [], suppliers: [], apiConfigs: [] },
    counts: {},
  },
  reducers: {
    clearSearch: (state) => {
      state.query = "";
      state.results = { users: [], suppliers: [], apiConfigs: [] };
      state.counts = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.query = action.payload.query;
        state.results = action.payload.results;
        state.counts = action.payload.counts;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
