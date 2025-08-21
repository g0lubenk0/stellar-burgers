import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors';

const MAX_INGREDIENTS = 6;

// Мемоизированное создание Map ингредиентов
const useIngredientsMap = (
  ingredients: TIngredient[]
): Map<string, TIngredient> =>
  useMemo(() => {
    const map = new Map();
    ingredients.forEach((ing) => map.set(ing._id, ing));
    return map;
  }, [ingredients]);

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients = useSelector(selectIngredients);
  const ingredientsMap = useIngredientsMap(ingredients);

  const orderInfo = useMemo(() => {
    if (ingredients.length === 0) return null;

    const ingredientsInfo: TIngredient[] = [];
    let total = 0;

    for (let i = 0; i < order.ingredients.length; i++) {
      const ingredient = ingredientsMap.get(order.ingredients[i]);
      if (ingredient) {
        ingredientsInfo.push(ingredient);
        total += ingredient.price;
      }
    }

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow: ingredientsInfo.slice(0, MAX_INGREDIENTS),
      remains: Math.max(0, ingredientsInfo.length - MAX_INGREDIENTS),
      total,
      date: new Date(order.createdAt)
    };
  }, [order, ingredientsMap, ingredients.length]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
});
