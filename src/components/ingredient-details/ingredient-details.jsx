import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectAllIngredients } from '@services/ingredients/slice';

import styles from './ingredient-details.module.css';

export const IngredientDetails = () => {
  const { id } = useParams();
  const ingredients = useSelector(selectAllIngredients);
  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return null;
  }

  const nutritionRows = [
    { label: 'Калории,ккал', value: ingredient.calories },
    { label: 'Белки, г', value: ingredient.proteins },
    { label: 'Жиры, г', value: ingredient.fat },
    { label: 'Углеводы, г', value: ingredient.carbohydrates },
  ];

  return (
    <div className={`${styles.wrap} pb-15`}>
      <img
        src={ingredient.image_large}
        alt={ingredient.name}
        className={`${styles.picture} mt-10`}
      />
      <p className={`${styles.title} text text_type_main-medium mt-4`}>
        {ingredient.name}
      </p>
      <ul className={`${styles.info} mt-8`}>
        {nutritionRows.map((row) => (
          <li key={row.label} className={styles.infoCell}>
            <p className="text text_type_main-default text_color_inactive">
              {row.label}
            </p>
            <p className="text text_type_digits-default text_color_inactive mt-2">
              {row.value}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
