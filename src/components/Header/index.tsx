/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="reactron" />
        <nav>
          <a className={styles.active} >Home</a>
          <a>Posts</a>
        </nav>
      </div>
    </header>
  );
}