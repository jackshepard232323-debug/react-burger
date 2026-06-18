import { CheckMarkIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import {
  selectOrderError,
  selectOrderIsPending,
  selectOrderNumber,
} from '@services/order/slice';

import styles from './order-details.module.css';

export const OrderDetails = () => {
  const number = useSelector(selectOrderNumber);
  const isPending = useSelector(selectOrderIsPending);
  const errorText = useSelector(selectOrderError);

  if (isPending) {
    return (
      <div className={`${styles.wrap} pb-30`}>
        <div className="mt-15">
          <Preloader />
        </div>
        <p className={`${styles.state} text text_type_main-default mt-15`}>
          Оформляем заказ...
        </p>
      </div>
    );
  }

  if (errorText) {
    return (
      <div className={`${styles.wrap} pb-30`}>
        <p className={`${styles.state} text text_type_main-medium mt-15`}>
          Не удалось оформить заказ
        </p>
        <p
          className={`${styles.note} text text_type_main-default text_color_inactive mt-4`}
        >
          {errorText}
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.wrap} pb-30`}>
      <p className={`${styles.number} text text_type_digits-large mt-15`}>{number}</p>
      <p className={`${styles.caption} text text_type_main-medium mt-8`}>
        идентификатор заказа
      </p>
      <div className={`${styles.markBox} mt-15`}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className={`${styles.state} text text_type_main-default mt-15`}>
        Ваш заказ начали готовить
      </p>
      <p
        className={`${styles.note} text text_type_main-default text_color_inactive mt-2`}
      >
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
