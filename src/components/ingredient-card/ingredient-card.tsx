import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useRef, type ReactElement } from 'react';
import { useDrag } from 'react-dnd';

import { useAppSelector } from '@/store/hooks';
import { selectIngredientCounts } from '@services/burger-constructor/slice';
import { DND_TYPES } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-card.module.css';

type TIngredientCardProps = {
  ingredient: TIngredient;
  onClick: (ingredient: TIngredient) => void;
};

export const IngredientCard = ({
  ingredient,
  onClick,
}: TIngredientCardProps): ReactElement => {
  const counts = useAppSelector(selectIngredientCounts);
  const count = counts[ingredient._id] || 0;
  const cardRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag<
    TIngredient,
    unknown,
    { isDragging: boolean }
  >({
    type: DND_TYPES.ingredient,
    item: ingredient,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(cardRef);

  const onCardClick = (): void => {
    onClick(ingredient);
  };

  return (
    <li
      ref={cardRef}
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
