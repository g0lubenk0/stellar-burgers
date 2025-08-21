import { useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { ConstructorPage } from '@pages';
import { AppHeader, Modal } from '@components';
import {
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFount404
} from '../../pages';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { OrderInfo } from '../order-info/order-info';
import { fetchIngredients } from '../../services/slices/ingredients';
import { selectIsAuthChecked, selectUser } from '../../services/selectors';
import { fetchUser, setAuthChecked } from '../../services/slices/user';
import '../../index.css';
import styles from './app.module.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) return null;
  if (!user) return <Navigate to='/login' replace state={{ from: location }} />;

  return children;
};

const AnonymousRoute = ({ children }: { children: JSX.Element }) => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) return null;
  if (user) return <Navigate to='/' replace />;

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location } | undefined;

  const handleModalClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchIngredients());

    const hasRefreshToken = Boolean(localStorage.getItem('refreshToken'));
    if (hasRefreshToken) {
      dispatch(fetchUser()).finally(() => {
        dispatch(setAuthChecked(true));
      });
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  const background = state?.background;
  const isModalOpen = Boolean(background);

  const routeConfig = [
    { path: '/', element: <ConstructorPage /> },
    { path: '/feed', element: <Feed /> },
    {
      path: '/login',
      element: (
        <AnonymousRoute>
          <Login />
        </AnonymousRoute>
      )
    },
    {
      path: '/register',
      element: (
        <AnonymousRoute>
          <Register />
        </AnonymousRoute>
      )
    },
    {
      path: '/forgot-password',
      element: (
        <AnonymousRoute>
          <ForgotPassword />
        </AnonymousRoute>
      )
    },
    {
      path: '/reset-password',
      element: (
        <AnonymousRoute>
          <ResetPassword />
        </AnonymousRoute>
      )
    },
    {
      path: '/profile',
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      )
    },
    {
      path: '/profile/orders',
      element: (
        <ProtectedRoute>
          <ProfileOrders />
        </ProtectedRoute>
      )
    },
    { path: '/ingredients/:id', element: <IngredientDetails /> },
    { path: '/feed/:id', element: <OrderInfo /> },
    {
      path: '/profile/orders/:id',
      element: (
        <ProtectedRoute>
          <OrderInfo />
        </ProtectedRoute>
      )
    },
    { path: '*', element: <NotFount404 /> }
  ];

  const modalRoutes = [
    {
      path: '/ingredients/:id',
      element: (
        <Modal title='Детали ингредиента' onClose={handleModalClose}>
          <IngredientDetails />
        </Modal>
      )
    },
    {
      path: '/feed/:id',
      element: (
        <Modal title='' onClose={handleModalClose}>
          <OrderInfo />
        </Modal>
      )
    },
    {
      path: '/profile/orders/:id',
      element: (
        <ProtectedRoute>
          <Modal title='' onClose={handleModalClose}>
            <OrderInfo />
          </Modal>
        </ProtectedRoute>
      )
    }
  ];

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        {routeConfig.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>

      {isModalOpen && (
        <Routes>
          {modalRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      )}
    </div>
  );
};

export default App;
