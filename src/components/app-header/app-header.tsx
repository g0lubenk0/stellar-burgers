import { FC, memo, useMemo } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/selectors';

export const AppHeader: FC = memo(() => {
  const user = useSelector(selectUser);
  const userName = user?.name;

  const headerProps = useMemo(() => ({ userName }), [userName]);

  return <AppHeaderUI {...headerProps} />;
});

AppHeader.displayName = 'AppHeader';
