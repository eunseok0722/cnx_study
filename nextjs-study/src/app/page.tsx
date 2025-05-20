// import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <h2 className={styles.page__title}>NEXT.JS PRACTICE HOME</h2>
      <div className={styles.page__content}>
        <ul>
          <li>
            <Link href="/Practice/Practice01">Practice01</Link>
          </li>
          <li>
            <Link href="/Practice/Practice02">Practice02</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
