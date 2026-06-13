import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/categories/";

const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.guestMode) {
        // Return default categories for guest mode
        return [
          { _id: '1', name: "Food & Dining", icon: "🍔", color: "#ef4444", type: "Expense" },
          { _id: '2', name: "Transport", icon: "🚗", color: "#f59e0b", type: "Expense" },
          { _id: '3', name: "Shopping", icon: "🛍️", color: "#ec4899", type: "Expense" },
          { _id: '4', name: "Entertainment", icon: "🎬", color: "#8b5cf6", type: "Expense" },
          { _id: '5', name: "Salary", icon: "💰", color: "#22c55e", type: "Income" },
          { _id: '6', name: "Freelance", icon: "💻", color: "#3b82f6", type: "Income" },
        ];
      }
      const response = await axios.get(API_URL, getConfig(thunkAPI));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addCategoryAsync = createAsyncThunk(
  "category/addCategory",
  async (categoryData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.guestMode) return { _id: Date.now().toString(), ...categoryData };
      const response = await axios.post(API_URL, categoryData, getConfig(thunkAPI));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  "category/updateCategory",
  async ({ id, categoryData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.auth.guestMode) return { _id: id, ...categoryData };
      const response = await axios.put(API_URL + id, categoryData, getConfig(thunkAPI));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  "category/deleteCategory",
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

const CategorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    resetCategoryState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        const index = state.categories.findIndex(c => c._id === action.payload._id || c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload && c.id !== action.payload);
      });
  }
});

export const { resetCategoryState } = CategorySlice.actions;
export default CategorySlice.reducer;
