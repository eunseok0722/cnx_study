import styles from "./styles.module.scss";
import {memo, useRef, useEffect, useContext, useLayoutEffect} from "react";
// import {TodoContext} from "../App";

const TodoItem = ({
  id,
  isDone,
  content,
  date,
  onUpdate,
  onDelete,
}: {
  id: number;
  isDone: boolean;
  content: string;
  date: number;
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  // useContext
  // const {onUpdate, onDelete} = useContext(TodoContext);

  // useRef
  // 1. 요소 참조
  const todoItemRef = useRef<HTMLDivElement>(null);
  // 2. 상태 저장
  const isMounted = useRef(false);

  // useLayoutEffect
  useLayoutEffect(() => {
    if (todoItemRef.current) {
      todoItemRef.current.classList.add(styles.beforeMounted);
    }
  }, []);

  // useEffect
  // 1. Mount
  useEffect(() => {
    if (todoItemRef.current) {
      todoItemRef.current.classList.add(styles.mounted);
      // setTimeout(() => {
      //   if (todoItemRef.current) {
      //     todoItemRef.current.classList.remove(styles.mounted);
      //   }
      // }, 500);
    }
  }, []);

  // 2. Update
  useEffect(() => {
    if (todoItemRef.current) {
      // 첫 렌더링 제외
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      todoItemRef.current.classList.add(styles.rerandered);
      setTimeout(() => {
        if (todoItemRef.current) {
          todoItemRef.current.classList.remove(styles.rerandered);
        }
      }, 500);
    }
  }, [isDone]);

  // 3. Unmount
  // 클린업, 정리 함수
  useEffect(() => {
    return () => {
      isMounted.current = false;
      console.log("unmount");
    };
  }, []);

  // onChangeCheckbox
  const onChangeCheckbox = () => {
    onUpdate(id);
  };

  // onClickDelete
  const onClickDelete = () => {
    onDelete(id);
  };

  return (
    <div ref={todoItemRef} className={styles.TodoItem}>
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
