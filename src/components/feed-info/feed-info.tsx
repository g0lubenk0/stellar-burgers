import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { selectFeed } from '../../services/selectors';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// Мемоизированная функция для получения заказов по статусу
const getOrdersByStatus = (orders: TOrder[], status: string): number[] => {
  const result: number[] = [];
  const limit: number = 20;
  for (let i = 0; i < orders.length && result.length < limit; i++) {
    if (orders[i].status === status) {
      result.push(orders[i].number);
    }
  }

  return result;
};

// Дефолтное значение для feed чтобы избежать повторных вычислений
const defaultFeed = { total: 0, totalToday: 0, orders: [] };

export const FeedInfo: FC = () => {
  const feed = useSelector(selectFeed);

  // Используем дефолтное значение если feed отсутствует
  const feedData = feed || defaultFeed;
  const orders = feedData.orders;

  // Мемоизируем вычисления для readyOrders и pendingOrders
  const [readyOrders, pendingOrders] = useMemo(
    () => [
      getOrdersByStatus(orders, 'done'),
      getOrdersByStatus(orders, 'pending')
    ],
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feedData}
    />
  );
};
