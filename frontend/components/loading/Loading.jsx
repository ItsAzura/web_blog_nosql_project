import React from 'react';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loader}>
      <div className={`${styles.inner} ${styles.one}`}></div>
      <div className={`${styles.inner} ${styles.two}`}></div>
      <div className={`${styles.inner} ${styles.three}`}></div>
    </div>
  );
};

export default Loading;
