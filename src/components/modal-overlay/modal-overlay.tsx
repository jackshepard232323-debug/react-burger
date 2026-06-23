import type { ReactElement } from 'react';

import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClick: () => void;
};

export const ModalOverlay = ({ onClick }: TModalOverlayProps): ReactElement => {
  return <div className={styles.backdrop} onClick={onClick} />;
};
