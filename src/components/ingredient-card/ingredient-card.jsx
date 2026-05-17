import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

import { selectIngredientCounts } from '@services/burger-constructor/slice';
import { DND_TYPES, ingredientPropType } from '@utils/prop-types';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient, onClick }) => {
  const counts = useSelector(selectIngredientCounts);
  const count = counts[ingredient._id] || 0;

  const [{ isDragging }, dragRef] = useDrag({
    type: DND_TYPES.ingredient,
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const onCardClick = () => {
    onClick(ingredient);
  };

  return (
    <li
      ref={dragRef}
      className={styles.box}
      onClick={onCardClick}
      style={{ opacity: isDragging ? 0.4 : 1 }}
    >
      {count > 0 && <Counter count={count} size="default" />}
      <img
        src={ingredient.image}
        alt={ingredient.name}
        className={`${styles.picture} ml-4 mr-4`}
      />
      <div className={`${styles.priceRow} mt-1 mb-1`}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.title} text text_type_main-default`}>{ingredient.name}</p>
    </li>
  );
};

IngredientCard.propTypes = {
  ingredient: ingredientPropType.isRequired,
  onClick: PropTypes.func.isRequired,
};
