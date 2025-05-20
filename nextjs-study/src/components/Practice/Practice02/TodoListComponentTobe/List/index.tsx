import styles from "./style.module.scss";
import TodoItem from "../TodoItem";
import {useState, useMemo, useContext} from "react";
// import {TodoContext} from "../App";

interface Todo {
  id: number;
  content: string;
  isDone: boolean;
  date: number;
}

const List = ({
  todos,
  onUpdate,
  onDelete,
}: {
  todos: Todo[];
  onUpdate: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  // useContext
  // const {todos} = useContext(TodoContext);

  // useState
  const [search, setSearch] = useState("");

  // onChangeSearch
  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // getFilteredData
  const getFilteredData = () => {
    if (search === "") return todos;
    return todos.filter((todo) => todo.content.toLowerCase().includes(search.toLowerCase()));
  };
  const filteredTodos = getFilteredData();

  // useMemo
  const {totalCount, doneCount, notDoneCount} = useMemo(() => {
    const totalCount = todos.length;
    const doneCount = todos.filter((todo) => todo.isDone).length;
    const notDoneCount = totalCount - doneCount;
    return {
      totalCount,
      doneCount,
      notDoneCount,
    };
  }, [todos]);

  return (
    <div className={styles.List}>
      <h4>Todo List ✅</h4>
      <ul className={styles.List__summary}>
        <li>Total: {totalCount}</li>
        <li>Done: {doneCount}</li>
        <li>Not Done: {notDoneCount}</li>
      </ul>
      <input type="text" placeholder="검색어를 입력하세요." value={search} onChange={onChangeSearch} />
      <div className={styles.todos_wrapper}>

        
        {/* {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))} */}

        {filteredTodos.map((todo) => {
          return <TodoItem key={todo.id} {...todo} onUpdate={onUpdate} onDelete={onDelete} />;
        })}
      </div>
    </div>
  );
};

export default List;
