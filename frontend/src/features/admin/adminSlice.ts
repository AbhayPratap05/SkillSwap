import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService';

interface User {
  _id: string;
  name: string;
  email: string;
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: string;
}

interface SwapRequest {
  _id: string;
  requestor: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  skillOffered: string;
  skillWanted: string;
  status: string;
  createdAt: string;
  feedback?: {
    fromRequestor?: {
      rating: number;
      comment: string;
    };
    fromRecipient?: {
      rating: number;
      comment: string;
    };
  };
}

interface Stats {
  users: {
    total: number;
    banned: number;
  };
  swaps: {
    total: number;
    byStatus: Array<{
      _id: string;
      count: number;
    }>;
  };
  platform: {
    averageRating: number;
    topSkills: Array<{
      _id: string;
      count: number;
    }>;
  };
}

interface AdminState {
  users: User[];
  swaps: SwapRequest[];
  stats: Stats | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: AdminState = {
  users: [],
  swaps: [],
  stats: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all users
export const getUsers = createAsyncThunk('admin/getUsers', async (_, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as any).auth.user.token;
    return await adminService.getUsers(token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Ban user
export const banUser = createAsyncThunk(
  'admin/banUser',
  async (userId: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as any).auth.user.token;
      return await adminService.banUser(userId, token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Unban user
export const unbanUser = createAsyncThunk(
  'admin/unbanUser',
  async (userId: string, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as any).auth.user.token;
      return await adminService.unbanUser(userId, token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all swaps
export const getSwaps = createAsyncThunk('admin/getSwaps', async (_, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as any).auth.user.token;
    return await adminService.getSwaps(token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Get platform stats
export const getStats = createAsyncThunk('admin/getStats', async (_, thunkAPI) => {
  try {
    const token = (thunkAPI.getState() as any).auth.user.token;
    return await adminService.getStats(token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Send platform message
export const sendMessage = createAsyncThunk(
  'admin/sendMessage',
  async (messageData: { title: string; message: string; type: string }, thunkAPI) => {
    try {
      const token = (thunkAPI.getState() as any).auth.user.token;
      return await adminService.sendMessage(messageData, token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
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
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.users.findIndex((user) => user._id === action.meta.arg);
        if (index !== -1) {
          state.users[index].isBanned = true;
        }
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.isSuccess = true;
        const index = state.users.findIndex((user) => user._id === action.meta.arg);
        if (index !== -1) {
          state.users[index].isBanned = false;
        }
      })
      .addCase(getSwaps.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSwaps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.swaps = action.payload;
      })
      .addCase(getSwaps.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.isSuccess = true;
      });
  },
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer; 