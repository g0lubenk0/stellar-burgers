import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { selectConstructor } from '../../services/selectors';

const EMPTY_CONSTRUCTOR = { bun: null, ingredients: [] };

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector(selectConstructor) || EMPTY_CONSTRUCTOR;

  const ingredientsCounters = useMemo(() => {
    const counters = new Map<string, number>();

    // Подсчет ингредиентов
    burgerConstructor.ingredients.forEach((ingredient: TIngredient) => {
      counters.set(ingredient._id, (counters.get(ingredient._id) || 0) + 1);
    });

    // Добавление булки
    const bunAmount = 2;
    if (burgerConstructor.bun) {
      counters.set(burgerConstructor.bun._id, bunAmount);
    }

    return Object.fromEntries(counters);
  }, [burgerConstructor.ingredients, burgerConstructor.bun]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
