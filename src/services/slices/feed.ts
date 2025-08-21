import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue
} from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData } from '@utils-types';

export type FeedState = {
  data: TOrdersData | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  data: null,
  isLoading: false,
  error: null
};

export const fetchFeed = createAsyncThunk(
  'feed/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getFeedsApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    selectFeedData: (state) => state.data,
    selectFeedLoading: (state) => state.isLoading,
    selectFeedError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addMatcher(isRejectedWithValue, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = feedSlice.actions;
export const { selectFeedData, selectFeedLoading, selectFeedError } =
  feedSlice.selectors;

export default feedSlice.reducer;
