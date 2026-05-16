import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { ingredientPropType } from '@utils/prop-types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients, onOrderClick }) => {
  const { selectedBun, innerItems, sum } = useMemo(() => {
    const acc = {
      selectedBun: null,
      innerItems: [],
      sum: 0,
    };

    ingredients.forEach((entry) => {
      if (entry.type === 'bun') {
        if (!acc.selectedBun) {
          acc.selectedBun = entry;
          acc.sum += entry.price * 2;
        }
        return;
      }
      acc.innerItems.push(entry);
      acc.sum += entry.price;
    });

    return acc;
  }, [ingredients]);

  if (!selectedBun) {
    return null;
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.bunRow}>
        <ConstructorElement
          type="top"
          isLocked={true}
          text={`${selectedBun.name} (верх)`}
          price={selectedBun.price}
          thumbnail={selectedBun.image}
        />
      </div>

      <ul className={`${styles.middle} custom-scroll`}>
        {innerItems.map((entry, idx) => (
          <li key={`${entry._id}-${idx}`} className={styles.middleItem}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={entry.name}
              price={entry.price}
              thumbnail={entry.image}
            />
          </li>
        ))}
      </ul>

      <div className={styles.bunRow}>
        <ConstructorElement
          type="bottom"
          isLocked={true}
          text={`${selectedBun.name} (низ)`}
          price={selectedBun.price}
          thumbnail={selectedBun.image}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.footerPrice}>
          <span className="text text_type_digits-medium mr-2">{sum}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
  onOrderClick: PropTypes.func.isRequired,
};
