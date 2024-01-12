import { useState, useEffect } from "react";
import { SideBar } from "./components/SideBar";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AllNotes } from "./pages/AllNotes";
import { Settings } from "./pages/Settings";
import { Trash } from "./pages/Trash";
import { About } from "./pages/About";
import { INote } from "./types/INote";
import "./App.css";

function App() {
  const [allNotes, setAllNotes] = useState<INote[]>([]);
  const navigate = useNavigate();

  const onNewNotes = () => {
    getAllNotesFromMain();
  };

  const getAllNotesFromMain = async () => {
    const allNotes = await window.electron.ipcRenderer.invoke("get-all-notes");
    setAllNotes(allNotes);
  };

  useEffect(() => {
    navigate("/all");
    getAllNotesFromMain();
  }, []);

  return (
    <div className="App">
      <div className="contetn-body">
        <SideBar />

        <div className="main-content">
          <Routes>
            <Route
              path="/all"
              element={<AllNotes allNotes={allNotes} onNewNotes={onNewNotes} />}
            />

            <Route
              path="/settings"
              element={<Settings onNewNotes={onNewNotes} />}
            />

            <Route path="/about" element={<About />} />

            <Route path="/trash" element={<Trash onNewNotes={onNewNotes} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
