import styles from "./styles.module.scss";
import {memo} from "react";

const Header = () => {
  return (
    <div className={styles.Header}>
      <p>오늘은 🗓️</p>
      <h1>{new Date().toDateString()}</h1>
    </div>
  );
};

// memo
export default memo(Header);
