import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useReducer, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients } from '@utils/api';

import styles from './app.module.css';

const REQUEST_STATUS = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
};

const initialRequestState = {
  status: REQUEST_STATUS.pending,
  data: [],
  errorText: null,
};

const requestReducer = (state, action) => {
  switch (action.type) {
    case 'start':
      return { ...state, status: REQUEST_STATUS.pending, errorText: null };
    case 'resolve':
      return { status: REQUEST_STATUS.resolved, data: action.payload, errorText: null };
    case 'reject':
      return { status: REQUEST_STATUS.rejected, data: [], errorText: action.payload };
    default:
      return state;
  }
};

const MODAL_TYPES = {
  ingredient: 'ingredient',
  order: 'order',
};

export const App = () => {
  const [request, dispatch] = useReducer(requestReducer, initialRequestState);

  const [openedModal, setOpenedModal] = useState(null);
  const [currentIngredient, setCurrentIngredient] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadIngredients = async () => {
      dispatch({ type: 'start' });
      try {
        const data = await getIngredients();
        if (!cancelled) {
          dispatch({ type: 'resolve', payload: data });
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Ошибка загрузки ингредиентов:', err);
        const message =
          err instanceof Error ? err.message : 'Не удалось загрузить ингредиенты';
        dispatch({ type: 'reject', payload: message });
      }
    };

    loadIngredients();

    return () => {
      cancelled = true;
    };
  }, []);

  const closeModal = useCallback(() => {
    setOpenedModal(null);
    setCurrentIngredient(null);
  }, []);

  const openOrderModal = useCallback(() => {
    setOpenedModal(MODAL_TYPES.order);
  }, []);

  const openIngredientModal = useCallback((ingredient) => {
    setCurrentIngredient(ingredient);
    setOpenedModal(MODAL_TYPES.ingredient);
  }, []);

  const renderMain = () => {
    if (request.status === REQUEST_STATUS.pending) {
      return (
        <div className={styles.stateMessage}>
          <Preloader />
        </div>
      );
    }

    if (request.status === REQUEST_STATUS.rejected) {
      return (
        <div className={styles.stateMessage}>
          <p className="text text_type_main-medium">
            Что-то пошло не так: {request.errorText}
          </p>
        </div>
      );
    }

    return (
      <>
        <BurgerIngredients
          ingredients={request.data}
          onIngredientClick={openIngredientModal}
        />
        <BurgerConstructor ingredients={request.data} onOrderClick={openOrderModal} />
      </>
    );
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>{renderMain()}</main>

      {openedModal === MODAL_TYPES.ingredient && currentIngredient && (
        <Modal title="Детали ингредиента" onClose={closeModal}>
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}

      {openedModal === MODAL_TYPES.order && (
        <Modal onClose={closeModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};
