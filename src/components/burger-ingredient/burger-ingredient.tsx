import { FC, memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/slices/constructor';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = useCallback(() => {
      dispatch(addIngredient(ingredient));
    }, [dispatch, ingredient]);

    const locationState = useCallback(
      () => ({ background: location }),
      [location]
    );

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={locationState()}
        handleAdd={handleAdd}
      />
    );
  }
);

BurgerIngredient.displayName = 'BurgerIngredient';
