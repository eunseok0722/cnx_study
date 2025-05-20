import styles from "./styles.module.scss";
import {memo, useContext} from "react";
// import {TodoContext} from "../App";

const TodoItem = ({id, isDone, content, date, onUpdate, onDelete}) => {
  // useContext
  // const {onUpdate, onDelete} = useContext(TodoContext);

  // onChangeCheckbox
  const onChangeCheckbox = () => {
    onUpdate(id);
  };

  // onClickDelete
  const onClickDelete = () => {
    onDelete(id);
  };

  return (
    <div className={styles.TodoItem}>
      <input readOnly checked={isDone} type="checkbox" onChange={onChangeCheckbox} />
      <div className={styles.content}>{content}</div>
      <div className={styles.date}>{new Date(date).toLocaleString()}</div>
      <button onClick={onClickDelete}>삭제</button>
    </div>
  );
};

// useMemo
// export default memo(TodoItem, (prevProps, nextProps) => {
//   if(prevProps.id !== nextProps.id) return false;
//   if(prevProps.isDone !== nextProps.isDone) return false;
//   if(prevProps.content !== nextProps.content) return false;
//   if(prevProps.date !== nextProps.date) return false;
//   return true;
// });

// useCallback
export default memo(TodoItem);
