import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef, type ReactElement } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useAppDispatch } from '@/store/hooks';
import { moveIngredient, removeIngredient } from '@services/burger-constructor/slice';
import { DND_TYPES } from '@utils/constants';

import type { TConstructorIngredient } from '@utils/types';

import styles from './constructor-element-draggable.module.css';

type TConstructorElementDraggableProps = {
  entry: TConstructorIngredient;
  index: number;
};

type TDragItem = {
  uid: string;
  index: number;
};

export const ConstructorElementDraggable = ({
  entry,
  index,
}: TConstructorElementDraggableProps): ReactElement => {
  const dispatch = useAppDispatch();
  const rowRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag<TDragItem, unknown, { isDragging: boolean }>(
    {
      type: DND_TYPES.constructorItem,
      item: { uid: entry.uid, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }
  );

  const [, dropRef] = useDrop<TDragItem>({
    accept: DND_TYPES.constructorItem,
    hover: (dragged, monitor): void => {
      if (!rowRef.current) return;
      const fromIndex = dragged.index;
      const toIndex = index;
      if (fromIndex === toIndex) return;

      const rect = rowRef.current.getBoundingClientRect();
      const middle = (rect.bottom - rect.top) / 2;
      const cursor = monitor.getClientOffset();
      if (!cursor) return;
      const cursorY = cursor.y - rect.top;

      if (fromIndex < toIndex && cursorY < middle) return;
      if (fromIndex > toIndex && cursorY > middle) return;

      dispatch(moveIngredient({ fromIndex, toIndex }));
      dragged.index = toIndex;
    },
  });

  dragRef(dropRef(rowRef));

  const onRemove = (): void => {
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
