import styles from "./styles.module.scss";

export default function ChildrenComponent({clickButton, count}: {clickButton: () => void, count: number}) {
  return (
    <button className={styles.button} onClick={clickButton}>
      <span className={styles.button__background} style={{height: `${count * 10}%`}}></span>
      <span className={styles.button__text}>
        버튼 <br />
        (자식 컴포넌트) <br />
      </span>
    </button>
  );
}
