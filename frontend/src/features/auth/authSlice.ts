import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  isAdmin?: boolean;
  profilePhoto?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  isHydrated: boolean;
}

// Get user from localStorage
const user = localStorage.getItem('user');
const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  isHydrated: false,
};

// Hydrate auth state from localStorage
export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const user = authService.getStoredUser();
  return user;
});

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData: { email: string; password: string }, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

// Validate token
export const validateToken = createAsyncThunk('auth/validateToken', async (_, thunkAPI) => {
  try {
    const user = authService.getStoredUser();
    if (!user?.token) {
      return thunkAPI.rejectWithValue('No token found');
    }
    return user;
  } catch (error: any) {
    return thunkAPI.rejectWithValue('Invalid token');
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isHydrated = true;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.user = null;
        state.isHydrated = true;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(validateToken.rejected, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer; 