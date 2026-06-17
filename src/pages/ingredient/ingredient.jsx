import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { selectIsLoading } from '@services/ingredients/slice';

import styles from './ingredient.module.css';

export const IngredientPage = () => {
  const isLoading = useSelector(selectIsLoading);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>
      <IngredientDetails />
    </div>
  );
};
