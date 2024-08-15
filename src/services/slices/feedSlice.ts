import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrdersData } from '../../utils/types';

type TFeedState = TOrdersData & {
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

export const fetchFeed = createAsyncThunk(
  'feed/getFeed',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue('Ошибка при получении ленты');
    }
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.isLoading = false;
        }
      )

      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  }
});

export const feedSelectors = {
  ordersSelector: (state: { feed: TFeedState }) => state.feed.orders,
  totalSelector: (state: { feed: TFeedState }) => state.feed.total,
  totalTodaySelector: (state: { feed: TFeedState }) => state.feed.totalToday,
  isLoadingSelector: (state: { feed: TFeedState }) => state.feed.isLoading,
  errorSelector: (state: { feed: TFeedState }) => state.feed.error
};

export default feedSlice.reducer;
