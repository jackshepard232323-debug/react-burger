import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useRef, useState, type ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/store/hooks';
import { IngredientCard } from '@components/ingredient-card/ingredient-card';
import { selectIngredientsByCategory } from '@services/ingredients/slice';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-ingredients.module.css';

const CATEGORY_ORDER: TIngredientType[] = ['bun', 'sauce', 'main'];

const CATEGORY_TITLES: Record<TIngredientType, string> = {
  bun: 'Булки',
  sauce: 'Соусы',
  main: 'Начинки',
};

export const BurgerIngredients = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const groups = useAppSelector(selectIngredientsByCategory);

  const [currentTab, setCurrentTab] = useState('bun');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const headingsMap = useRef<Record<string, HTMLHeadingElement>>({});

  const registerHeading = useCallback(
    (category: string) =>
      (node: HTMLHeadingElement | null): void => {
        if (node) {
          headingsMap.current[category] = node;
        } else {
          delete headingsMap.current[category];
        }
      },
    []
  );

  const handleScroll = useCallback(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;
    const containerTop = scrollArea.getBoundingClientRect().top;

    let nearest = currentTab;
    let nearestDistance = Infinity;

    CATEGORY_ORDER.forEach((category) => {
      const heading = headingsMap.current[category];
      if (!heading) return;
      const distance = Math.abs(heading.getBoundingClientRect().top - containerTop);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = category;
      }
    });

    if (nearest !== currentTab) {
      setCurrentTab(nearest);
    }
  }, [currentTab]);

  const onTabClick = useCallback((nextTab: string) => {
    setCurrentTab(nextTab);
    const scrollArea = scrollAreaRef.current;
    const heading = headingsMap.current[nextTab];
    if (scrollArea && heading) {
      const top = heading.offsetTop - scrollArea.offsetTop;
      scrollArea.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const onCardClick = useCallback(
    (ingredient: TIngredient) => {
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location },
      });
    },
    [navigate, location]
  );

  return (
    <section className={styles.root}>
      <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>

      <nav className={styles.tabBar}>
        <ul className={styles.tabList}>
          <Tab value="bun" active={currentTab === 'bun'} onClick={onTabClick}>
            Булки
          </Tab>
          <Tab value="sauce" active={currentTab === 'sauce'} onClick={onTabClick}>
            Соусы
          </Tab>
          <Tab value="main" active={currentTab === 'main'} onClick={onTabClick}>
            Начинки
          </Tab>
        </ul>
      </nav>

      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className={`${styles.scrollArea} custom-scroll mt-10`}
      >
        {CATEGORY_ORDER.map((category) => (
          <section key={category} className={styles.group}>
            <h2
              ref={registerHeading(category)}
              className="text text_type_main-medium mb-6"
            >
              {CATEGORY_TITLES[category]}
            </h2>
            <ul className={`${styles.grid} pl-4 pr-4 pb-10`}>
              {groups[category].map((entry) => (
                <IngredientCard
                  key={entry._id}
                  ingredient={entry}
                  onClick={onCardClick}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
