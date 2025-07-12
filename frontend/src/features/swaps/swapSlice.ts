import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import swapService from './swapService';

interface SwapState {
  swaps: any[];
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
}

const initialState: SwapState = {
  swaps: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Create new swap request
export const createSwapRequest = createAsyncThunk(
  'swaps/create',
  async (swapData: any, thunkAPI) => {
    try {
      return await swapService.createSwapRequest(swapData);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get user swap requests
export const getSwapRequests = createAsyncThunk('swaps/getAll', async (_, thunkAPI) => {
  try {
    console.log('getSwapRequests thunk called');
    const response = await swapService.getSwapRequests();
    console.log('getSwapRequests response:', response);
    return response;
  } catch (error: any) {
    console.error('getSwapRequests error:', error);
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update swap status
export const updateSwapStatus = createAsyncThunk(
  'swaps/updateStatus',
  async ({ swapId, status }: { swapId: string; status: string }, thunkAPI) => {
    try {
      return await swapService.updateSwapStatus(swapId, status);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add feedback
export const addFeedback = createAsyncThunk(
  'swaps/addFeedback',
  async (
    { swapId, feedback }: { swapId: string; feedback: { rating: number; comment: string } },
    thunkAPI
  ) => {
    try {
      return await swapService.addFeedback(swapId, feedback);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete swap request
export const deleteSwapRequest = createAsyncThunk(
  'swaps/delete',
  async (swapId: string, thunkAPI) => {
    try {
      await swapService.deleteSwapRequest(swapId);
      return swapId;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const swapSlice = createSlice({
  name: 'swaps',
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
      .addCase(createSwapRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.swaps.push(action.payload);
      })
      .addCase(createSwapRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(getSwapRequests.pending, (state) => {
        console.log('getSwapRequests.pending');
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getSwapRequests.fulfilled, (state, action) => {
        console.log('getSwapRequests.fulfilled:', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.swaps = action.payload;
      })
      .addCase(getSwapRequests.rejected, (state, action) => {
        console.log('getSwapRequests.rejected:', action.payload);
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateSwapStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.swaps.findIndex((swap) => swap._id === action.payload._id);
        if (index !== -1) {
          state.swaps[index] = action.payload;
        }
      })
      .addCase(addFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.swaps.findIndex((swap) => swap._id === action.payload._id);
        if (index !== -1) {
          state.swaps[index] = action.payload;
        }
      })
      .addCase(deleteSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.swaps = state.swaps.filter((swap) => swap._id !== action.payload);
      });
  },
});

export const { reset } = swapSlice.actions;
export default swapSlice.reducer; 