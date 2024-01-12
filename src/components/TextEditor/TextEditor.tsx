import React, { useEffect, useState, useRef } from "react";

// Editor's imports
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { extractContentFromHtmlString } from "../../utils/extractContentFromHtmlString";
import { INote } from "../../types/INote";
import { toolbarSetup, toolbarS } from "./toolbarSetup";

type Props = {
  noteId: string;
  onNewNotes: () => void;
};

export const TextEditor: React.FC<Props> = ({ noteId, onNewNotes }) => {
  const editorRef = useRef(null);
  const [data, setData] = useState(EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(true);

  const onEditorStateChange = (con: any) => {
    setData(con);
  };

  const saveNoteToDb = async () => {
    try {
      const htmlData = draftToHtml(convertToRaw(data.getCurrentContent()));
      const noteTitle = extractContentFromHtmlString(htmlData.split("\n")[0]);
      const noteDataToSave = {
        id: noteId,
        title: noteTitle,
        content: htmlData,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        removedAt: null,
      };

      const checkNoteInDb: INote[] = await window.electron.ipcRenderer.invoke(
        "get-note",
        [noteId]
      );
      if (checkNoteInDb.length) {
        await window.electron.ipcRenderer.invoke("update-note", [
          noteDataToSave,
        ]);
      } else {
        await window.electron.ipcRenderer.invoke("create-note", [
          noteDataToSave,
        ]);
      }
      onNewNotes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (
      !extractContentFromHtmlString(
        draftToHtml(convertToRaw(data.getCurrentContent())).split("\n")[0]
      )
    ) {
      return;
    }
    saveNoteToDb();
  }, [data]);

  const getInitData = async () => {
    try {
      const checkNoteInDb: INote[] = await window.electron.ipcRenderer.invoke(
        "get-note",
        [noteId]
      );
      if (!checkNoteInDb.length) {
        setIsLoading(false);
        return;
      }

      const html = checkNoteInDb[0].content;
      const contentBlock = htmlToDraft(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setData(editorState);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getInitData();
  }, []);

  useEffect(() => {
    getInitData();
  }, [noteId]);

  if (isLoading) {
    return <div></div>;
  }

  return (
    <Editor
      editorState={data}
      /*toolbar={toolbarSetup}*/
      /*toolbar={toolbarS}*/
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName="editorClassName"
      onEditorStateChange={onEditorStateChange}
    />
  );
};
