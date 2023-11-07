import styles from './LoadingOverlay.module.scss';

export const LoadingOverlay = () => (
  <div className={styles["loading-overlay"]}>
    <div className={styles["loading-spinner"]}>
      <img src="/loading.gif" alt="Loading" />
      Loading...
    </div>
  </div>
);

