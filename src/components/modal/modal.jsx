import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

const portalRoot = document.getElementById('modals');

export const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

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

Modal.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
