import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { ConstructorElementDraggable } from '@components/constructor-element-draggable/constructor-element-draggable';
import { ConstructorPlaceholder } from '@components/constructor-placeholder/constructor-placeholder';
import {
  addIngredient,
  selectBun,
  selectConstructorIngredients,
  selectOrderIngredientIds,
  selectTotalPrice,
} from '@services/burger-constructor/slice';
import { createOrder } from '@services/order/actions';
import { selectOrderIsPending } from '@services/order/slice';
import { DND_TYPES } from '@utils/prop-types';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();

  const bun = useSelector(selectBun);
  const innerItems = useSelector(selectConstructorIngredients);
  const totalPrice = useSelector(selectTotalPrice);
  const orderIds = useSelector(selectOrderIngredientIds);
  const isOrderPending = useSelector(selectOrderIsPending);

  const [{ isOverBunTop, canDropBunTop }, bunTopDropRef] = useDrop({
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

  const [{ isOverBunBottom, canDropBunBottom }, bunBottomDropRef] = useDrop({
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

  const [{ isOverFillings, canDropFillings }, fillingsDropRef] = useDrop({
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

  const onOrderClick = () => {
    if (!bun || isOrderPending) return;
    dispatch(createOrder(orderIds));
  };

  const canOrder = Boolean(bun) && !isOrderPending;

  return (
    <section className={styles.wrapper}>
      <div ref={bunTopDropRef} className={styles.bunRow}>
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
        ref={fillingsDropRef}
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

      <div ref={bunBottomDropRef} className={styles.bunRow}>
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
