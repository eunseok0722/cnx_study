import styles from "./styles.module.scss";
import {useState, useRef, useContext} from "react";
// import {TodoContext} from "../index";

const Editor = ({onCreate} : {onCreate: (content: string) => void}) => {

  // useContext
  // const {onCreate} = useContext(TodoContext);

  // useState
  const [content, setContent] = useState("");
  
  // useRef
  const contentRef = useRef<HTMLInputElement>(null);
  
  // onChangeContent
  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  
  // onSubmit
  const onSubmit = () => {
    // 제출될 때 인풋에 포커스
    if (contentRef.current) {
      contentRef.current.focus();
    }
    if (content === "") return;
    onCreate(content);
    setContent("");
  };

  // onKeyDown
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };


  return (
    <div className={styles.Editor}>
      <input
        ref={contentRef}
        type="text"
        placeholder="새로운 Todo..."
        value={content}
        onChange={onChangeContent}
        onKeyDown={onKeyDown}
      />
      <button type="button" onClick={onSubmit}>
        추가
      </button>
    </div>
  );
};

export default Editor;
