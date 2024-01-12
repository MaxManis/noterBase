import React, { useEffect, useState, useRef } from "react";
import { ButtonMain } from "../../components/ButtonMain";
import { TextEditor } from "../../components/TextEditor";
import { INote } from "../../types/INote";

type Props = {
  allNotes: INote[];
  onNewNotes: () => void;
};

type SelectedNote = INote;

export const AllNotes: React.FC<Props> = ({ allNotes, onNewNotes }) => {
  const [selectedNote, setSelectedNote] = useState<SelectedNote | null>(null);
  const [createNewNote, setCreateNewNote] = useState<SelectedNote | null>(null);

  const [searchBy, setSearchBy] = useState("");
  const [visibleNotes, setVisibleNotes] = useState<INote[] | null>(null);

  const onDeleteNote = async (noteIdToDel: string | undefined) => {
    try {
      if (!noteIdToDel) {
        return;
      }

      // TODO: move to trash not del at all
      await window.electron.ipcRenderer.invoke("remove-note", [
        noteIdToDel,
        new Date().toString(),
      ]);

      setCreateNewNote(null);
      setSelectedNote(null);
      onNewNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const setFilteredNotes = () => {
    const newFilteredNotes = allNotes.filter((note) =>
      note.content.toLowerCase().includes(searchBy.toLowerCase())
    );
    setVisibleNotes(newFilteredNotes);
  };

  useEffect(() => {
    setVisibleNotes(allNotes);
  }, []);
  useEffect(() => {
    setVisibleNotes(allNotes);
  }, [allNotes]);
  useEffect(() => {
    setFilteredNotes();
  }, [searchBy]);

  return (
    <>
      <div className="main-content__first" id="allNotes">
        <div className="main-content__first-search">
          <span>All notes</span>
          <ButtonMain
            onClick={() => {
              setSelectedNote(null);
              setCreateNewNote({
                id: window.crypto.randomUUID(),
                title: "",
                content: "",
                createdAt: "",
                updatedAt: "",
                removedAt: null,
              });
            }}
            buttonText={
              <>
                <svg
                  className="side-bar__icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                  />
                </svg>
              </>
            }
          />
        </div>
        <div className="main-content__search">
          <svg
            className="side-bar__icon main-content__search-icon"
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
            />
          </svg>
          <input
            value={searchBy}
            placeholder={"Search"}
            onChange={(e) => setSearchBy(e.target.value)}
            className="main-content__search-field"
            type="text"
          />
        </div>
        <div>
          {visibleNotes &&
            visibleNotes.length > 0 &&
            visibleNotes.map((note) => (
              <div
                key={note.id}
                className="main-content__note_prev"
                onClick={() => {
                  setCreateNewNote(null);
                  setSelectedNote(() => note);
                }}
              >
                {note.title.length > 20
                  ? note.title.slice(0, 20) + "..."
                  : note.title}
              </div>
            ))}
          {(!visibleNotes || !allNotes) && (
            <div className="main-content__note_prev">no Notes yet</div>
          )}
          {visibleNotes?.length === 0 && (
            <div className="main-content__note_prev">Notes not found</div>
          )}
        </div>
      </div>

      <div className="main-content__second">
        {(selectedNote || createNewNote) && (
          <div className="main-content__first-search">
            <span>{selectedNote || createNewNote ? "Note" : ""}</span>
            <ButtonMain
              onClick={() => {
                onDeleteNote(
                  selectedNote?.id || createNewNote?.id || undefined
                );
              }}
              buttonText={
                <>
                  <svg
                    className="side-bar__icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                    />
                  </svg>
                </>
              }
            />
          </div>
        )}
        {!selectedNote && !createNewNote && (
          <div className="startInfo">
            <h1 style={{ textShadow: "3px 3px 5px rgba(137,137,137,0.9)" }}>
              NoterBase!
            </h1>
            <span style={{ fontSize: "16px" }}>
              Where Your Notes Find a Secure Home.
            </span>
          </div>
        )}

        {selectedNote && !createNewNote && (
          <div className="noteContentBlock" id="noteContent">
            <TextEditor onNewNotes={onNewNotes} noteId={selectedNote.id} />
          </div>
        )}

        {!selectedNote && createNewNote && (
          <div className="noteContentBlock" id="createNewContent">
            <TextEditor onNewNotes={onNewNotes} noteId={createNewNote.id} />
          </div>
        )}
      </div>
    </>
  );
};
