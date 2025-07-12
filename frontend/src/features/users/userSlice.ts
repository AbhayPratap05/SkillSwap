import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  location?: string;
  availability: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  totalRatings: number;
  isPublic: boolean;
}

interface UserState {
  profile: User | null;
  selectedUser: User | null;
  searchResults: User[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: UserState = {
  profile: null,
  selectedUser: null,
  searchResults: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get user profile
export const getProfile = createAsyncThunk('users/getProfile', async (_, thunkAPI) => {
  try {
    return await userService.getProfile();
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update user profile
export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (userData: Partial<User>, thunkAPI) => {
    try {
      return await userService.updateProfile(userData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Search users
export const searchUsers = createAsyncThunk(
  'users/search',
  async (searchParams: { skill?: string; type?: 'offered' | 'wanted' }, thunkAPI) => {
    try {
      return await userService.searchUsers(searchParams);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user by ID
export const getUserById = createAsyncThunk(
  'users/getById',
  async (userId: string, thunkAPI) => {
    try {
      return await userService.getUserById(userId);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { reset, clearSearchResults, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer; 