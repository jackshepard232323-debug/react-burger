import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  clearCurrentIngredient,
  selectCurrentIngredient,
} from '@services/ingredient-details/slice';
import { fetchIngredients } from '@services/ingredients/actions';
import {
  selectIngredientsError,
  selectIsFailure,
  selectIsLoading,
} from '@services/ingredients/slice';
import { clearOrder, selectOrderNumber } from '@services/order/slice';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);
  const isFailure = useSelector(selectIsFailure);
  const errorText = useSelector(selectIngredientsError);

  const currentIngredient = useSelector(selectCurrentIngredient);
  const orderNumber = useSelector(selectOrderNumber);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const closeIngredientModal = () => {
    dispatch(clearCurrentIngredient());
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const renderMain = () => {
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
      <>
        <BurgerIngredients />
        <BurgerConstructor />
      </>
    );
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>{renderMain()}</main>

      {currentIngredient && (
        <Modal title="Детали ингредиента" onClose={closeIngredientModal}>
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}

      {orderNumber !== null && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
