import {Reducer} from "react";

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
const reducer: Reducer<Todo[], TodoAction> = (state: Todo[], action: TodoAction) => {
  switch (action.type) {
    case "CREATE":
      return [action.data, ...state];
    case "UPDATE":
      return state.map((item) => {
        return item.id === action.targetId ? {...item, isDone: !item.isDone} : item;
      });
    case "DELETE":
      return state.filter((item) => {
        return item.id !== action.targetId ? true : false;
      });
    default:
      return state;
  }
}

export default reducer;
