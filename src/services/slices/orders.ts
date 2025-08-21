import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export type CreateOrderState = {
  currentOrder: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: CreateOrderState = {
  currentOrder: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось создать заказ'
      );
    }
  }
);

const createOrderSlice = createSlice({
  name: 'createOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    }
  },
  selectors: {
    selectCurrentOrder: (state) => state.currentOrder,
    selectOrderLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error,
    selectOrderNumber: (state) => state.currentOrder?.number
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.isLoading = false;
      })
      .addMatcher(isRejectedWithValue, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrder } = createOrderSlice.actions;
export const {
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
  selectOrderNumber
} = createOrderSlice.selectors;

export default createOrderSlice.reducer;
