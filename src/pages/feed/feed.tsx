import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feed';
import { selectFeed, selectFeedLoading } from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const isLoading = useSelector(selectFeedLoading);
  const orders: TOrder[] = feed?.orders || [];
  useEffect(() => {
    if (!orders.length && !isLoading) {
      dispatch(fetchFeed());
    }
  }, [dispatch]);

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
