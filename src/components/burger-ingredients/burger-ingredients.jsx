import { Tab } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useRef, useState } from 'react';

import { IngredientCard } from '@components/ingredient-card/ingredient-card';
import { ingredientPropType } from '@utils/prop-types';

import styles from './burger-ingredients.module.css';

const CATEGORY_ORDER = ['bun', 'sauce', 'main'];

const CATEGORY_TITLES = {
  bun: 'Булки',
  sauce: 'Соусы',
  main: 'Начинки',
};

export const BurgerIngredients = ({ ingredients, onIngredientClick }) => {
  const [currentTab, setCurrentTab] = useState('bun');

  const scrollAreaRef = useRef(null);
  const headingsMap = useRef({});

  const registerHeading = useCallback(
    (category) => (node) => {
      if (node) {
        headingsMap.current[category] = node;
      } else {
        delete headingsMap.current[category];
      }
    },
    []
  );

  const groups = useMemo(() => {
    const initial = CATEGORY_ORDER.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});

    return ingredients.reduce((acc, entry) => {
      if (acc[entry.type]) {
        acc[entry.type].push(entry);
      }
      return acc;
    }, initial);
  }, [ingredients]);

  const onTabClick = useCallback((nextTab) => {
    setCurrentTab(nextTab);
    const scrollArea = scrollAreaRef.current;
    const heading = headingsMap.current[nextTab];
    if (scrollArea && heading) {
      const top = heading.offsetTop - scrollArea.offsetTop;
      scrollArea.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

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

      <div ref={scrollAreaRef} className={`${styles.scrollArea} custom-scroll mt-10`}>
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
                  count={1}
                  onClick={onIngredientClick}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
  onIngredientClick: PropTypes.func.isRequired,
};
