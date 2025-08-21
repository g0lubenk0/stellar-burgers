import { FC, useMemo, useCallback } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectConstructor,
  selectCreateOrder,
  selectUser
} from '../../services/selectors';
import { createOrder } from '../../services/slices/orders';
import { resetConstructor } from '../../services/slices/constructor';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearOrder } from '../../services/slices/orders';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructor);
  const { isLoading: orderRequest, currentOrder: orderModalData } =
    useSelector(selectCreateOrder);
  const user = useSelector(selectUser);

  const safeConstructorItems = useMemo(
    () => ({
      bun: constructorItems?.bun || null,
      ingredients: constructorItems?.ingredients || []
    }),
    [constructorItems]
  );

  const price = useMemo(() => {
    const bunMultiplier: number = 2;
    const bunPrice: number = safeConstructorItems.bun
      ? safeConstructorItems.bun.price * bunMultiplier
      : 0;
    const ingredientsPrice = safeConstructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [safeConstructorItems]);

  const onOrderClick = useCallback(() => {
    if (!safeConstructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    const ingredientIds = [
      safeConstructorItems.bun._id,
      ...safeConstructorItems.ingredients.map((i) => i._id),
      safeConstructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds)).then(() => {
      dispatch(resetConstructor());
    });
  }, [safeConstructorItems, orderRequest, user, navigate, location, dispatch]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={safeConstructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
