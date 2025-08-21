import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchProfileOrders } from '../../services/slices/profileOrders';
import {
  selectProfileOrders,
  selectProfileOrdersLoading
} from '../../services/selectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  useEffect(() => {
    if (!orders.length && !isLoading) {
      dispatch(fetchProfileOrders());
    }
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
