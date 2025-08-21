import { useState, useRef, useEffect, FC, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/selectors';

// Константы для типов ингредиентов
const INGREDIENT_TYPES = {
  BUN: 'bun',
  MAIN: 'main',
  SAUCE: 'sauce'
} as const;

export const BurgerIngredients: FC = () => {
  const allIngredients = useSelector(selectIngredients);

  // Оптимизированное разделение ингредиентов
  const [buns, mains, sauces] = useMemo(() => {
    const bunsArray: typeof allIngredients = [];
    const mainsArray: typeof allIngredients = [];
    const saucesArray: typeof allIngredients = [];

    allIngredients.forEach((ingredient) => {
      switch (ingredient.type) {
        case INGREDIENT_TYPES.BUN:
          bunsArray.push(ingredient);
          break;
        case INGREDIENT_TYPES.MAIN:
          mainsArray.push(ingredient);
          break;
        case INGREDIENT_TYPES.SAUCE:
          saucesArray.push(ingredient);
          break;
      }
    });

    return [bunsArray, mainsArray, saucesArray];
  }, [allIngredients]);

  const [currentTab, setCurrentTab] = useState<TTabMode>(INGREDIENT_TYPES.BUN);

  // Рефы для заголовков
  const titleRefs = {
    [INGREDIENT_TYPES.BUN]: useRef<HTMLHeadingElement>(null),
    [INGREDIENT_TYPES.MAIN]: useRef<HTMLHeadingElement>(null),
    [INGREDIENT_TYPES.SAUCE]: useRef<HTMLHeadingElement>(null)
  };

  // Наблюдатели за видимостью секций
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Определение активной вкладки на основе видимости
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab(INGREDIENT_TYPES.BUN);
    } else if (inViewSauces) {
      setCurrentTab(INGREDIENT_TYPES.SAUCE);
    } else if (inViewFilling) {
      setCurrentTab(INGREDIENT_TYPES.MAIN);
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Мемоизированный обработчик клика по вкладке
  const onTabClick = useCallback((tab: string) => {
    const tabKey = tab as TTabMode;
    setCurrentTab(tabKey);
    titleRefs[tabKey].current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Группировка рефов для передачи в UI компонент
  const refs = {
    bunsRef,
    mainsRef,
    saucesRef,
    titleBunRef: titleRefs[INGREDIENT_TYPES.BUN],
    titleMainRef: titleRefs[INGREDIENT_TYPES.MAIN],
    titleSaucesRef: titleRefs[INGREDIENT_TYPES.SAUCE]
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      onTabClick={onTabClick}
      {...refs}
    />
  );
};
