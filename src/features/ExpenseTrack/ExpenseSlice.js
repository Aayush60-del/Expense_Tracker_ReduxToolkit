import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
const API_URL = `${API_BASE_URL}/transactions/`;

const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const fetchTransactions = createAsyncThunk(
  "expense/fetchTransactions",
  async (queryParams, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.guestMode) return { transactions: null }; // handled locally by keeping existing persisted state
      
      let url = API_URL;
      if (queryParams) {
        const params = new URLSearchParams(queryParams).toString();
        url += `?${params}`;
      }
      
      const response = await axios.get(url, getConfig(thunkAPI));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchStats = createAsyncThunk(
  "expense/fetchStats",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.guestMode) return null; // handled locally later if needed
      const response = await axios.get(API_URL + "stats", getConfig(thunkAPI));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addTransactionAsync = createAsyncThunk(
  "expense/addTransaction",
  async (transactionData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      // 🔥 GUEST MODE FIX
      if (state.auth.guestMode) {
        return {
          _id: Date.now().toString(),
          ...transactionData,
          date: transactionData.date || new Date().toISOString(),
        };
      }

      const response = await axios.post(
        API_URL,
        transactionData,
        getConfig(thunkAPI)
      );

      return {
        ...response.data,
        _id: response.data._id || response.data.id || Date.now().toString(),
        date: response.data.date || transactionData.date || new Date().toISOString(),
      };

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const updateTransactionAsync = createAsyncThunk(
  "expense/updateTransaction",
  async ({ id, transactionData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.guestMode) return { _id: id, ...transactionData };
      const response = await axios.put(API_URL + id, transactionData, getConfig(thunkAPI));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTransactionAsync = createAsyncThunk(
  "expense/deleteTransaction",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.guestMode) return id;
      await axios.delete(API_URL + id, getConfig(thunkAPI));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const ExpenseSlice = createSlice({
  name: "expense",
  initialState: {
    transactions: [],
    stats: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.stats = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => { state.isLoading = true; })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.transactions) {
          state.transactions = action.payload.transactions;
          state.totalCount = action.payload.total;
          state.currentPage = action.payload.page;
          state.totalPages = action.payload.pages;
        }
        // If it's guest mode, action.payload.transactions is null, so we keep the persisted state
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(addTransactionAsync.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      .addCase(updateTransactionAsync.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t._id === action.payload._id || t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((t) => t._id !== action.payload && t.id !== action.payload);
      });
  },
});

export const { reset, clearTransactions } = ExpenseSlice.actions;
export default ExpenseSlice.reducer;