import styles from "../practice.module.scss";
import ParentComponent from "@/components/Practice/Practice01/ParentComponent/index";
export default function Practice01() {
  return (
    <div className={`${styles.practice} container`}>
      {/* header */}
      <div className={styles.practice__header}>
        <h2 className={styles.practice__title}>Practice01</h2>
        <div className={styles.practice__subtitle}>연습 목표</div>
        <ol className={styles.practice__description}>
          <li>부모 컴포넌트인 &quot;페이지&quot;와 자식 컴포넌트인 &quot;버튼&quot;을 만든다.</li>
          <li>자식 컴포넌트에게 prop전달, 부모 컴포넌트에 이벤트를 전달하여 컴포넌트간 통신을 구현한다.</li>
        </ol>
      </div>
      {/* // header */}
      {/* // body */}
      <div className={styles.practice__body}>
        <div className={styles.practice__subtitle}>실습내용</div>
        <div className={styles.practice__content}>
          <ParentComponent />
        </div>
      </div>
      {/* // body */}
    </div>
  );
}
