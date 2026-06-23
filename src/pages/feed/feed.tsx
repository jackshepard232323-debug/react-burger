import type { ReactElement } from 'react';

import styles from './feed.module.css';

export const FeedPage = (): ReactElement => {
  return (
    <main className={styles.page}>
      <p className="text text_type_main-medium">Страница в разработке</p>
    </main>
  );
};
