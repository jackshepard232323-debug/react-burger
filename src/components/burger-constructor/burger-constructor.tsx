import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, type ReactElement } from 'react';
import { useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ConstructorElementDraggable } from '@components/constructor-element-draggable/constructor-element-draggable';
import { ConstructorPlaceholder } from '@components/constructor-placeholder/constructor-placeholder';
import { selectIsAuthenticated } from '@services/auth/slice';
import {
  addIngredient,
  selectBun,
  selectConstructorIngredients,
  selectOrderIngredientIds,
  selectTotalPrice,
} from '@services/burger-constructor/slice';
import { createOrder } from '@services/order/actions';
import { selectOrderIsPending } from '@services/order/slice';
import { DND_TYPES } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const bun = useAppSelector(selectBun);
  const innerItems = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectTotalPrice);
  const orderIds = useAppSelector(selectOrderIngredientIds);
  const isOrderPending = useAppSelector(selectOrderIsPending);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const bunTopRef = useRef<HTMLDivElement>(null);
  const bunBottomRef = useRef<HTMLDivElement>(null);
  const fillingsRef = useRef<HTMLUListElement>(null);

  const [{ isOverBunTop, canDropBunTop }, bunTopDropRef] = useDrop<
    TIngredient,
    unknown,
    { isOverBunTop: boolean; canDropBunTop: boolean }
  >({
    accept: DND_TYPES.ingredient,
    canDrop: (item) => item.type === 'bun',
    drop: (item) => {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => ({
      isOverBunTop: monitor.isOver(),
      canDropBunTop: monitor.canDrop(),
    }),
  });
  bunTopDropRef(bunTopRef);

  const [{ isOverBunBottom, canDropBunBottom }, bunBottomDropRef] = useDrop<
    TIngredient,
    unknown,
    { isOverBunBottom: boolean; canDropBunBottom: boolean }
  >({
    accept: DND_TYPES.ingredient,
    canDrop: (item) => item.type === 'bun',
    drop: (item) => {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => ({
      isOverBunBottom: monitor.isOver(),
      canDropBunBottom: monitor.canDrop(),
    }),
  });
  bunBottomDropRef(bunBottomRef);

  const [{ isOverFillings, canDropFillings }, fillingsDropRef] = useDrop<
    TIngredient,
    unknown,
    { isOverFillings: boolean; canDropFillings: boolean }
  >({
    accept: DND_TYPES.ingredient,
    canDrop: (item) => item.type !== 'bun',
    drop: (item) => {
      dispatch(addIngredient(item));
    },
    collect: (monitor) => ({
      isOverFillings: monitor.isOver(),
      canDropFillings: monitor.canDrop(),
    }),
  });
  fillingsDropRef(fillingsRef);

  const onOrderClick = (): void => {
    if (!bun || isOrderPending) {
      return;
    }
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    dispatch(createOrder(orderIds));
  };

  const canOrder = Boolean(bun) && !isOrderPending;

  return (
    <section className={styles.wrapper}>
      <div ref={bunTopRef} className={styles.bunRow}>
        {bun ? (
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <ConstructorPlaceholder
            position="top"
            label="Выберите булку"
            isOver={isOverBunTop}
            canDrop={canDropBunTop}
          />
        )}
      </div>

      <ul
        ref={fillingsRef}
        className={`${styles.middle} custom-scroll ${
          canDropFillings ? styles.middleDropping : ''
        } ${isOverFillings && canDropFillings ? styles.middleOver : ''}`}
      >
        {innerItems.length === 0 ? (
          <ConstructorPlaceholder
            position="middle"
            label="Выберите начинку"
            isOver={isOverFillings}
            canDrop={canDropFillings}
          />
        ) : (
          innerItems.map((entry, idx) => (
            <ConstructorElementDraggable key={entry.uid} entry={entry} index={idx} />
          ))
        )}
      </ul>

      <div ref={bunBottomRef} className={styles.bunRow}>
        {bun ? (
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        ) : (
          <ConstructorPlaceholder
            position="bottom"
            label="Выберите булку"
            isOver={isOverBunBottom}
            canDrop={canDropBunBottom}
          />
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerPrice}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={onOrderClick}
          disabled={!canOrder}
        >
          {isOrderPending ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>
    </section>
  );
};
