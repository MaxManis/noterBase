import React, { useEffect, useState, useRef } from "react";
import { ButtonMain } from "../../components/ButtonMain";
import { ErrorToast } from "../../components/ErrorToast";
import { Loader } from "../../components/Loader";
import { Modal } from "../../components/Modal";
import { SuccessToast } from "../../components/SuccessToast";
import s from "./Settings.module.css";

type Props = {
  onNewNotes: () => void;
};

export const Settings: React.FC<Props> = ({ onNewNotes }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<null | string>(null);
  const [isError, setIsError] = useState<null | string>(null);

  const [isExportModal, setIsExportModal] = useState(false);
  const [isImportModal, setIsImportModal] = useState(false);
  const [exportKey, setExportKey] = useState("");
  const [importKey, setImportKey] = useState("");

  const importRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLInputElement>(null);

  const showError = (msg: string) => {
    setIsError(msg);
    setTimeout(() => {
      setIsError(null);
    }, 3000);
  };
  const showSuccess = (msg: string) => {
    setIsSuccess(msg);
    setTimeout(() => {
      setIsSuccess(null);
    }, 3000);
  };

  useEffect(() => {
    if (isExportModal) {
      exportRef.current?.focus();
    }
  }, [isExportModal]);

  useEffect(() => {
    if (isImportModal) {
      importRef.current?.focus();
    }
  }, [isImportModal]);

  const onExportAllNotes = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      if (!exportKey || exportKey.length < 3) {
        return;
      }

      const isExported: boolean = await window.electron.ipcRenderer.invoke(
        "export-all",
        [exportKey]
      );

      isExported
        ? showSuccess("Exported successfuly!")
        : showError("Unexpected error on export");
    } catch (err) {
      console.error(err);
      showError("Unexpected error on export");
    }
    setExportKey("");
    setIsExportModal(false);
    setIsLoading(false);
  };

  const onImportAllNotes = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      if (!importKey || importKey.length < 3) {
        return;
      }

      const isImported: boolean = await window.electron.ipcRenderer.invoke(
        "import-all",
        [importKey]
      );

      isImported
        ? showSuccess("Imported successfuly!")
        : showError("Import error. Wrong password or file.");
    } catch (err) {
      console.error(err);
      showError("Unexpected error on import");
    }
    setImportKey("");
    setIsImportModal(false);
    onNewNotes();
    setIsLoading(false);
  };

  return (
    <div className={s.settingsContent + " pos-rel flex-1"}>
      {isLoading && <Loader isAbsolute isBlur />}

      {isSuccess && <SuccessToast text={isSuccess} />}

      {isError && <ErrorToast text={isError} />}

      {isExportModal && (
        <Modal
          title={"Secure Export Notes"}
          text={
            <>
              <span style={{ textAlign: "left" }}>
                Securely Transfer Your Notes: Export your notes as an encoded
                file to easily move them to another computer or just for backup.
                Simply create an encryption key before exporting and use the
                same key during the import process to decode your notes. Ensure
                consistency by using the same key for both export and import
                steps.
              </span>
              <label style={{ fontWeight: 600 }} htmlFor="keyInput">
                Your key:
              </label>
              <input
                ref={exportRef}
                value={exportKey}
                onChange={(e) => setExportKey(e.target.value)}
                id="keyInput"
                type="text"
              />
            </>
          }
          buttons={
            <>
              <ButtonMain
                buttonText={<>Export</>}
                onClick={() => onExportAllNotes()}
              />
              <ButtonMain
                buttonText={<>Close</>}
                onClick={() => setIsExportModal(false)}
              />
            </>
          }
        />
      )}
      {isImportModal && (
        <Modal
          title={"Secure Import Notes"}
          text={
            <>
              <span style={{ textAlign: "left" }}>
                Effortlessly Import Your Notes: Bring your notes into NoterBase
                from another computer or restore from the backup with ease. To
                decode your notes correctly, please remember to provide the same
                encryption key used during the export process. This ensures a
                seamless import experience, maintaining the security and
                integrity of your data.
              </span>
              <label style={{ fontWeight: 600 }} htmlFor="keyInput">
                Your key:
              </label>
              <input
                ref={importRef}
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
                id="keyInput"
                type="text"
              />
            </>
          }
          buttons={
            <>
              <ButtonMain
                buttonText={<>Import</>}
                onClick={() => onImportAllNotes()}
              />
              <ButtonMain
                buttonText={<>Close</>}
                onClick={() => setIsImportModal(false)}
              />
            </>
          }
        />
      )}
      <div className={s.settingsTitle}>Settings</div>
      <div className={s.settingsButtonsGroup}>
        <ButtonMain
          buttonText={
            <>
              <svg
                className="side-bar__icon"
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 576 512"
              >
                <path
                  fill="currentColor"
                  d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V288H216c-13.3 0-24 10.7-24 24s10.7 24 24 24H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM384 336V288H494.1l-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39H384zm0-208H256V0L384 128z"
                />
              </svg>
              Export all notes
            </>
          }
          onClick={() => {
            setIsImportModal(false);
            setIsExportModal(true);
          }}
        />
        <ButtonMain
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
                  d="M128 64c0-35.3 28.7-64 64-64H352V128c0 17.7 14.3 32 32 32H512V448c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V336H302.1l-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39H128V64zm0 224v48H24c-13.3 0-24-10.7-24-24s10.7-24 24-24H128zM512 128H384V0L512 128z"
                />
              </svg>
              Import all notes
            </>
          }
          onClick={() => {
            setIsExportModal(false);
            setIsImportModal(true);
          }}
        />
      </div>
    </div>
  );
};
