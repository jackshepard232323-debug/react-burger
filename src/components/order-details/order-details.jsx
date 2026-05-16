import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

const FAKE_ORDER_NUMBER = '034536';

export const OrderDetails = () => {
  return (
    <div className={`${styles.wrap} pb-30`}>
      <p className={`${styles.number} text text_type_digits-large mt-15`}>
        {FAKE_ORDER_NUMBER}
      </p>
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
