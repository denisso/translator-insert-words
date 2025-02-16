"use client";
import React from "react";
import sm, { StatePublic } from "@/StateManager";
import { TextInfo } from "@/db";
import ListTexts from "@/Components/ListTexts";
import useConstructor from "@/utils/useConstructor";
import smd, { changeText, saveTextToDB } from "./state";
import TextEditor from "./Editor";
import styles from "./DashBoard.module.css";
import classNames from "classnames";

type Dispatch = (newState: TextInfo["id"][]) => void;

class Selector {
  attach(dispatch: Dispatch) {
    sm().attach("texts", (texts: StatePublic["texts"]) => {
      dispatch(
        Object.keys(texts).sort((a, b) => {
          if (a.length === b.length) {
            return a.localeCompare(b);
          }
          return a.length - b.length;
        })
      );
    });
  }
}

const pushToTextEditorCallBack = {
  cb: (id: string) => {
    changeText("push", id);
  },
  name: "Push to editor",
};

type EditorProps = {
  className: string;
};

const Editor = ({ className }: EditorProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    smd().state.getName = () =>
      inputRef.current ? inputRef.current.value : "";
    
  }, []);
  return (
    <div className={className}>
      <div className={styles.name}>
        <input
          type="text"
          className={styles.input}
          onChange={() => changeText("input")}
        />
        <button className="reset">Reset</button>
      </div>
      <TextEditor className={styles.editorElement} />
    </div>
  );
};

const EditorButtons = ({ className }: EditorProps) => {
  const [disable, setDisable] = React.useState(false);
  const onNewText = () => {
    if (disable) return;
    changeText("new");
  };
  const onSaveText = () => {
    if (disable) return;
    saveTextToDB(() => setDisable(false));
  };
  return (
    <div className={className}>
      <button onClick={onNewText} disabled={disable}>
        New text
      </button>
      <button onClick={onSaveText} disabled={disable}>
        Save text
      </button>
      <span className="text">Editor</span>
    </div>
  );
};

const DashBoard = () => {
  const selector = useConstructor(Selector);

  return (
    <>
      <div className={classNames(styles.box, styles.header)}>
        <div className={styles.item}>
          <span className="text">List texts</span>
        </div>
        <EditorButtons className={classNames(styles.item, styles.editor)} />
      </div>
      <div className={classNames(styles.box, styles.content)}>
        <ListTexts
          selector={selector}
          action={pushToTextEditorCallBack}
          className={styles.item}
        />
        <Editor className={classNames(styles.item, styles.editor)} />
      </div>
    </>
  );
};

export default DashBoard;
