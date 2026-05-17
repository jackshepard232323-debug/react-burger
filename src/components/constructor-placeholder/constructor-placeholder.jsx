import PropTypes from 'prop-types';

import styles from './constructor-placeholder.module.css';

export const ConstructorPlaceholder = ({ position, label, isOver, canDrop }) => {
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

ConstructorPlaceholder.propTypes = {
  position: PropTypes.oneOf(['top', 'middle', 'bottom']).isRequired,
  label: PropTypes.string.isRequired,
  isOver: PropTypes.bool,
  canDrop: PropTypes.bool,
};

ConstructorPlaceholder.defaultProps = {
  isOver: false,
  canDrop: false,
};
