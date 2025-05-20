import styles from "./styles.module.scss";
import {useState, useRef, useContext} from "react";
// import {TodoContext} from "../index";

const Editor = ({onCreate}: {onCreate: (content: string) => void}) => {

  // useContext
  // const {onCreate} = useContext(TodoContext);

  // useState
  const [content, setContent] = useState("");
  
  // useRef
  const contentRef = useRef(null);
  
  // onChangeContent
  const onChangeContent = (e) => {
    setContent(e.target.value);
  };
  
  // onSubmit
  const onSubmit = () => {
    contentRef.current.focus();
    if (content === "") return;
    onCreate(content);
    setContent("");
  };

  // onKeyDown
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === 13) {
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
