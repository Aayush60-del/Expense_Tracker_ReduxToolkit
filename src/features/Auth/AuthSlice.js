import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";
const API_URL = `${API_BASE_URL}/auth/`;

// Helper to get token
const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user?.token;
  return {
    headers: { Authorization: `Bearer \${token}` }
  };
};

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "register", user);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.removeItem("guestMode");
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "login", user);
      if (response.data && !response.data.requiresOtp) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.removeItem("guestMode");
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "verify-otp", data);
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.removeItem("guestMode");
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "resend-otp", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "forgot-password", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyResetOtp = createAsyncThunk(
  "auth/verifyResetOtp",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "verify-reset-otp", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(API_URL + "reset-password", data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.put(API_URL + "profile", userData, getConfig(thunkAPI));
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "auth/uploadAvatar",
  async (formData, thunkAPI) => {
    try {
      const stateUser = thunkAPI.getState().auth.user;
      const localUser = JSON.parse(localStorage.getItem("user") || "null");
      const token = stateUser?.token || localUser?.token;

      if (!token) {
        return thunkAPI.rejectWithValue("Login again. Token missing.");
      }

      const response = await axios.post(API_URL + "upload-avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = {
        ...(stateUser || localUser || {}),
        ...response.data,
        avatar: response.data.avatar || response.data.avatarUrl,
        token: response.data.token || token,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwords, thunkAPI) => {
    try {
      const response = await axios.put(API_URL + "password", passwords, getConfig(thunkAPI));
      const currentUser = thunkAPI.getState().auth.user;
      const updatedUser = response.data?.user || response.data;
      return {
        ...currentUser,
        ...updatedUser,
        token: updatedUser?.token || currentUser?.token,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAccount = createAsyncThunk("auth/deleteAccount", async (_, thunkAPI) => {
  try {
    const response = await axios.delete(API_URL + "account", getConfig(thunkAPI));
    localStorage.removeItem("user");
    localStorage.removeItem("guestMode");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("guestMode");
});

const user = JSON.parse(localStorage.getItem("user"));
const guestMode = localStorage.getItem("guestMode") === "true";

const initialState = {
  user: user ? user : null,
  guestMode: guestMode,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  requiresOtp: false,
  otpEmail: "",
  resetEmail: "",
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
    guestLogin: (state) => {
      state.guestMode = true;
      localStorage.setItem("guestMode", "true");
    },
    setResetEmail: (state, action) => {
      state.resetEmail = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.guestMode = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Login
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload.requiresOtp) {
          state.requiresOtp = true;
          state.otpEmail = action.payload.email;
          state.message = action.payload.message;
        } else {
          state.user = action.payload;
          state.guestMode = false;
          state.requiresOtp = false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        state.requiresOtp = false;
      })
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => { state.isLoading = true; })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.guestMode = false;
        state.requiresOtp = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Resend OTP
      .addCase(resendOtp.pending, (state) => { state.isLoading = true; })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => { state.isLoading = true; })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Verify Reset OTP
      .addCase(verifyResetOtp.pending, (state) => { state.isLoading = true; })
      .addCase(verifyResetOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(verifyResetOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => { state.isLoading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
        state.message = action.payload.message || "Avatar uploaded successfully";
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => { state.isLoading = true; })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.guestMode = false;
        state.requiresOtp = false;
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;
        state.guestMode = false;
        state.requiresOtp = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, guestLogin, setResetEmail } = AuthSlice.actions;
export default AuthSlice.reducer;
