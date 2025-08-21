import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue
} from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить заказы'
      );
    }
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
    clearProfileError: (state) => {
      state.error = null;
    }
  },
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersLoading: (state) => state.isLoading,
    selectProfileOrdersError: (state) => state.error,
    selectProfileOrderById: (state) => (id: string) =>
      state.orders.find((order) => order._id === id),
    selectProfileOrdersByStatus: (state) => (status: string) =>
      state.orders.filter((order) => order.status === status)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addMatcher(isRejectedWithValue, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearProfileOrders, clearProfileError } =
  profileOrdersSlice.actions;
export const {
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError,
  selectProfileOrderById,
  selectProfileOrdersByStatus
} = profileOrdersSlice.selectors;

export default profileOrdersSlice.reducer;
