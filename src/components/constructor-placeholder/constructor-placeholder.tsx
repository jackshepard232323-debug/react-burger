import type { ReactElement } from 'react';

import styles from './constructor-placeholder.module.css';

type TConstructorPlaceholderProps = {
  position: 'top' | 'middle' | 'bottom';
  label: string;
  isOver?: boolean;
  canDrop?: boolean;
};

export const ConstructorPlaceholder = ({
  position,
  label,
  isOver = false,
  canDrop = false,
}: TConstructorPlaceholderProps): ReactElement => {
  const highlight = isOver && canDrop;
  const dropping = canDrop && !isOver;

  const positionClass =
    position === 'top'
      ? styles.placeholderTop
      : position === 'bottom'
        ? styles.placeholderBottom
        : styles.placeholderMiddle;

  return (
    <div
      className={`${styles.placeholder} ${positionClass} ${
        highlight ? styles.highlight : ''
      } ${dropping ? styles.dropping : ''}`}
    >
      <p className="text text_type_main-default text_color_inactive">{label}</p>
    </div>
  );
};
