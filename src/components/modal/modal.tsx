import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

const portalRoot = document.getElementById('modals');

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({
  title,
  onClose,
  children,
}: TModalProps): ReactElement | null => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return (): void => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (!portalRoot) {
    return null;
  }

  const node = (
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.window}>
        <header className={`${styles.top} pt-10 pr-10 pl-10`}>
          {title && (
            <h2 className={`${styles.heading} text text_type_main-large`}>{title}</h2>
          )}
          <button
            type="button"
            className={styles.btnClose}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </>
  );

  return createPortal(node, portalRoot);
};
