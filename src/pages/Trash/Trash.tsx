import React, { useEffect, useState, useRef } from "react";
import { ButtonMain } from "../../components/ButtonMain";
import { INote } from "../../types/INote";
import s from "./Trash.module.css";

type Props = {
  onNewNotes: () => void;
};

export const Trash: React.FC<Props> = ({ onNewNotes }) => {
  const [removedNotes, setRemovedNotes] = useState<INote[] | null>(null);

  const restoreFromTrash = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke("restore-note", [id]);
      await getRemovedNotesFromDB();
      onNewNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteForever = async (id: string) => {
    try {
      await window.electron.ipcRenderer.invoke("delete-note-forever", [id]);
      await getRemovedNotesFromDB();
      onNewNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const getRemovedNotesFromDB = async () => {
    try {
      const notesData = await window.electron.ipcRenderer.invoke(
        "get-removed-notes"
      );
      setRemovedNotes(notesData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getRemovedNotesFromDB();
  }, []);
  return (
    <div className={s.trashAllCards}>
      <div className={s.trashTitle}>Trash</div>
      {removedNotes &&
        removedNotes.map((note) => (
          <div
            className={s.trashCard + " main-content__note_prev"}
            key={note.id}
          >
            {note.title.length > 20
              ? note.title.slice(0, 20) + "..."
              : note.title}

            <div className={s.trashCardButtons}>
              <ButtonMain
                onClick={() => {
                  restoreFromTrash(note.id);
                }}
                buttonText={
                  <>
                    <svg
                      className="side-bar__icon"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"
                      />
                    </svg>
                  </>
                }
              />
              <ButtonMain
                onClick={() => {
                  deleteForever(note.id);
                }}
                buttonText={
                  <>
                    <svg
                      className="side-bar__icon"
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 576 512"
                      style={{ color: "#de4141" }}
                    >
                      <path
                        fill="currentColor"
                        d="M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                      />
                    </svg>
                  </>
                }
              />
            </div>
          </div>
        ))}

      {(!removedNotes || removedNotes.length === 0) && (
        <div className="main-content__note_prev">Notes removed notes yet</div>
      )}
    </div>
  );
};
