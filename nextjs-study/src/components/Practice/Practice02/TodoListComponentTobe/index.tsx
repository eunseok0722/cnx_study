"use client";

import styles from "./styles.module.scss";
import {useState, useRef, useReducer, useCallback, createContext} from "react";
import Header from "./Header/index";
import Editor from "./Editor/index";
import List from "./List/index";

// TodoList 더미 데이터 생성
const mockData = [
  {
    id: 0,
    isDone: false,
    content: "React 공부하기",
    date: new Date().getTime(),
  },
  {
    id: 1,
    isDone: false,
    content: "빨래하기",
    date: new Date().getTime(),
  },
  {
    id: 2,
    isDone: false,
    content: "잠자기",
    date: new Date().getTime(),
  },
];

interface Todo {
  id: number;
  content: string;
  isDone: boolean;
  date: number;
}

interface TodoAction {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  data?: Todo;
  targetId?: number;
}

// useReducer
// reducer: 상태 변화 관리를 위한 함수
function reducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "CREATE":
      return action.data ? [action.data, ...state] : state;
    case "UPDATE":
      return state.map((item) => {
        return item.id === action.targetId ? {...item, isDone: !item.isDone} : item;
      });
    case "DELETE":
      return state.filter((item) => {
        return item.id !== action.targetId;
      });
    default:
      return state;
  }
}

// createContext
// 상태관리를 위한 외부 컨텍스트 객체 생성
// export const TodoContext = createContext(null);

const TodoListComponent = () => {
  // useState
  // const [todos, setTodos] = useState(mockData);

  // useRef
  const idRef = useRef(3);

  // useReducer
  const [todos, dispatch] = useReducer(reducer, mockData);

  // dispatch
  // dispatch(액션객체)

  // useCallback
  // useCallback(콜백 함수, 의존성 배열)

  const onCreate = useCallback((content: string) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        isDone: false,
        content: content,
        date: new Date().getTime(),
      },
    });
  }, []);

  const onUpdate = useCallback((targetId: number) => {
    dispatch({
      type: "UPDATE",
      targetId: targetId,
    });
  }, []);

  const onDelete = useCallback((targetId: number) => {
    dispatch({
      type: "DELETE",
      targetId: targetId,
    });
  }, []);

  return (
    <div className={styles.App}>
      <Header />
      <Editor onCreate={onCreate} />
      <List todos={todos} onUpdate={onUpdate} onDelete={onDelete} />

      {/* useContext */}
      {/* <Header />
      <TodoContext.Provider value={{todos, onCreate, onUpdate, onDelete}}>
        <Editor />
        <List />
      </TodoContext.Provider> */}
    </div>
  );
};

export default TodoListComponent;
