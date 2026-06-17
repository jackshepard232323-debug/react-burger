import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector } from 'react-redux';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import {
  selectIngredientsError,
  selectIsFailure,
  selectIsLoading,
} from '@services/ingredients/slice';

import styles from './home.module.css';

export const HomePage = () => {
  const isLoading = useSelector(selectIsLoading);
  const isFailure = useSelector(selectIsFailure);
  const errorText = useSelector(selectIngredientsError);

  if (isLoading) {
    return (
      <div className={styles.stateMessage}>
        <Preloader />
      </div>
    );
  }

  if (isFailure) {
    return (
      <div className={styles.stateMessage}>
        <p className="text text_type_main-medium">Что-то пошло не так: {errorText}</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <main className={styles.main}>
        <BurgerIngredients />
        <BurgerConstructor />
      </main>
    </DndProvider>
  );
};
