import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { moveIngredient, removeIngredient } from '@services/burger-constructor/slice';
import { constructorIngredientPropType, DND_TYPES } from '@utils/prop-types';

import styles from './constructor-element-draggable.module.css';

export const ConstructorElementDraggable = ({ entry, index }) => {
  const dispatch = useDispatch();
  const rowRef = useRef(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: DND_TYPES.constructorItem,
    item: { uid: entry.uid, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: DND_TYPES.constructorItem,
    hover: (dragged, monitor) => {
      if (!rowRef.current) return;
      const fromIndex = dragged.index;
      const toIndex = index;
      if (fromIndex === toIndex) return;

      const rect = rowRef.current.getBoundingClientRect();
      const middle = (rect.bottom - rect.top) / 2;
      const cursor = monitor.getClientOffset();
      const cursorY = cursor.y - rect.top;

      if (fromIndex < toIndex && cursorY < middle) return;
      if (fromIndex > toIndex && cursorY > middle) return;

      dispatch(moveIngredient({ fromIndex, toIndex }));
      dragged.index = toIndex;
    },
  });

  dragRef(dropRef(rowRef));

  const onRemove = () => {
    dispatch(removeIngredient(entry.uid));
  };

  return (
    <li ref={rowRef} className={styles.row} style={{ opacity: isDragging ? 0.3 : 1 }}>
      <DragIcon type="primary" />
      <ConstructorElement
        text={entry.name}
        price={entry.price}
        thumbnail={entry.image}
        handleClose={onRemove}
      />
    </li>
  );
};

ConstructorElementDraggable.propTypes = {
  entry: constructorIngredientPropType.isRequired,
  index: PropTypes.number.isRequired,
};
