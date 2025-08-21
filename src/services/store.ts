import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredients from './slices/ingredients';
import constructorReducer from './slices/constructor';
import createOrder from './slices/orders';
import feed from './slices/feed';
import user from './slices/user';
import profileOrders from './slices/profileOrders';

const store = configureStore({
  reducer: {
    ingredients,
    burgerConstructor: constructorReducer,
    createOrder,
    feed,
    user,
    profileOrders
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
