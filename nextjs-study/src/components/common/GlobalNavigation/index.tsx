import Link from "next/link";
import styles from "./styles.module.scss";

export default function GlobalNavigation() {
  return (
    <nav className={styles.gnb}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/Practice/Practice01">Practice01</Link>
        </li>
        <li>
          <Link href="/Practice/Practice02">Practice02</Link>
        </li>
      </ul>
    </nav>
  );
}
