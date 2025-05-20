"use client";

import styles from "./styles.module.scss";
import {useState} from "react";
import ChildrenComponent from "../ChildrenComponent";

export default function ParentComponent() {
  // 상태
  const [count, setCount] = useState(0);
  // 이벤트 핸들러
  const clickButton = () => {
    setCount((count) => {
      if (count < 10) {
        return count + 1;
      } else {
        count = 0;
        return count;
      }
    });
  };
  return (
    <div className={styles.parent}>
      <h3>페이지 (부모 컴포넌트)</h3>
      <div className={styles.parent__content}>
        <div>
          버튼을 <br></br>
          클릭한 횟수 <br />
          <strong>{count}</strong>
        </div>
        <div>
          <ChildrenComponent clickButton={clickButton} count={count} />
        </div>
      </div>
    </div>
  );
}
