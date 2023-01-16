import styles from "./LoadingSpinner.module.css";

function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.middle}></div>
        <div className={styles.bottom}></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
