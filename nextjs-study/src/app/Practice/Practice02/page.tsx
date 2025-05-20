import styles from "../practice.module.scss";
import TodoListComponent from "@/components/Practice/Practice02/TodoListComponent";
import TodoListComponentTobe from "@/components/Practice/Practice02/TodoListComponentTobe";

export default function Practice02() {
  return (
    <div className={`${styles.practice} container`}>
      {/* header */}
      <div className={styles.practice__header}>
        <h2 className={styles.practice__title}>Practice02</h2>
        <div className={styles.practice__subtitle}>연습 목표</div>
        <ol className={styles.practice__description}>
          <li>상태관리, 랜더링/생명주기, 최적화에 해당하는 카테고리의 Hook의 개념을 익힌다.</li>
          <li>해당 Hooks를 활용한 예제를 만들어본다. </li>
        </ol>
        <div className={styles.practice__subtitle}>개념 정리</div>
        <div className={styles.practice__cta}>
          <a
            href="https://www.notion.so/oheunseok/Practice02-React-Hooks-1f748adf653d80a682efe4f536658a9d"
            target="_blank"
          >
            <span>노션 링크</span>
          </a>
        </div>
      </div>
      {/* // header */}
      {/* // body */}
      <div className={styles.practice__body}>
        <div className={styles.practice__subtitle}>활용 실습</div>
        <div className={styles.practice__content}>
          <TodoListComponent />
          {/* <TodoListComponentTobe /> */}
        </div>
      </div>
      {/* // body */}
    </div>
  );
}
