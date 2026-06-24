import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
const API_URL = `${API_BASE_URL}/settings`;

const defaultSettings = {
  emailNotifications: true,
  transactionAlerts: true,
  monthlyReports: true,
  budgetAlerts: true,
  theme: "system",
  currency: "INR",
  language: "English",
  timezone: "Asia/Kolkata",
  monthlyBudget: 0,
  twoFactorEnabled: false,
};

const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) return defaultSettings;

      const response = await axios.get(API_URL, getConfig(thunkAPI));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const saveSettings = createAsyncThunk(
  "settings/saveSettings",
  async (settingsData, thunkAPI) => {
    try {
      const response = await axios.put(API_URL, settingsData, getConfig(thunkAPI));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const SettingsSlice = createSlice({
  name: "settings",
  initialState: {
    settings: defaultSettings,
    isLoading: false,
    isSaving: false,
    isError: false,
    message: "",
  },
  reducers: {
    resetSettingsState: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = { ...defaultSettings, ...action.payload };
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(saveSettings.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(saveSettings.fulfilled, (state, action) => {
        state.isSaving = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(saveSettings.rejected, (state, action) => {
        state.isSaving = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetSettingsState } = SettingsSlice.actions;
export default SettingsSlice.reducer;
