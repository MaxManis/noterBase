import { app, BrowserWindow, ipcMain, dialog } from "electron";
import * as path from "path";
import * as fs from "fs";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { dbConnect } from "./db";
import { INote } from "./types/INote";
import * as crypto from "crypto";
import { config } from "./config";

const { DATA_DIR_NAME, DB_FILE_NAME, CRYPTING_ALGORYTHM } = config;

let mainWindow: Electron.BrowserWindow | null = null;

const dbCreateAndConnect = () => {
  let rootDir = __dirname;
  if (app.isPackaged) {
    rootDir = app.getPath("userData");
  }

  if (!fs.existsSync(path.join(rootDir, DATA_DIR_NAME))) {
    fs.mkdirSync(path.join(rootDir, DATA_DIR_NAME));
  }

  if (!fs.existsSync(path.join(rootDir, DATA_DIR_NAME, DB_FILE_NAME))) {
    fs.writeFileSync(path.join(rootDir, DATA_DIR_NAME, DB_FILE_NAME), "");
  }

  return dbConnect(path.join(rootDir, DATA_DIR_NAME, DB_FILE_NAME));
};

const db = dbCreateAndConnect();

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: "NoterBase",
    icon: path.join(__dirname, "logo.ico"),
    webPreferences: {
      // contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow = win;

  if (app.isPackaged) {
    win.loadURL(`file://${__dirname}/../index.html`);
  } else {
    win.loadURL("http://localhost:3000/index.html");

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : "")
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });
  }

  win.once("ready-to-show", () => win.show());
}

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

ipcMain.on("get-path", function (event, arg) {
  const currPath = path.join(__dirname);
  event.sender.send("get-path-reply", currPath);
});

ipcMain.handle("get-all-notes", async function (event, arg) {
  return new Promise((res) => {
    db.all(
      "SELECT * FROM notes WHERE removedAt IS NULL ORDER BY createdAt DESC",
      (err, rows) => {
        res(rows);
      }
    );
  });
});

ipcMain.handle("get-removed-notes", async function (event, arg) {
  return new Promise((res) => {
    db.all(
      "SELECT * FROM notes WHERE removedAt IS NOT NULL ORDER BY removedAt DESC",
      (err, rows) => {
        res(rows);
      }
    );
  });
});

ipcMain.handle("update-note", async function (event, arg) {
  const updateNote: INote = arg[0];
  return new Promise((res) => {
    db.all(
      "UPDATE notes SET title = ?, content = ?, updatedAt = ? WHERE id = ?",
      [
        updateNote.title,
        updateNote.content,
        updateNote.updatedAt,
        updateNote.id,
      ],
      (err, rows) => {
        res(rows);
      }
    );
  });
});

ipcMain.handle("create-note", async function (event, arg) {
  const newNote: INote = arg[0];
  return new Promise((res) => {
    db.all(
      "INSERT INTO notes VALUES (?, ?, ?, ?, ?, ?)",
      [
        newNote.id,
        newNote.title,
        newNote.content,
        newNote.createdAt,
        newNote.updatedAt,
        newNote.removedAt,
      ],
      (err, rows) => {
        res(rows);
      }
    );
  });
});

ipcMain.handle("get-note", async function (event, arg) {
  return new Promise((res) => {
    db.all("SELECT * FROM notes WHERE id=?", [arg[0]], (err, rows) => {
      res(rows);
    });
  });
});

ipcMain.handle("delete-note", async function (event, arg) {
  return new Promise((res) => {
    db.all("DELETE FROM notes WHERE id=?", [arg[0]], (err, rows) => {
      res(rows);
    });
  });
});

ipcMain.handle("remove-note", async function (event, arg) {
  return new Promise((res) => {
    db.all(
      "UPDATE notes SET removedAt = ? WHERE id = ?",
      [arg[1], arg[0]],
      (err, rows) => {
        res(rows);
      }
    );
  });
});

ipcMain.handle("restore-note", async function (event, arg) {
  return new Promise((res) => {
    db.all(
      "UPDATE notes SET removedAt = NULL WHERE id = ?",
      [arg[0]],
      (err, rows) => {
        res(rows);
      }
    );
  });
});

ipcMain.handle("delete-note-forever", async function (event, arg) {
  return new Promise((res) => {
    db.all("DELETE FROM notes WHERE id = ?", [arg[0]], (err, rows) => {
      res(rows);
    });
  });
});

ipcMain.handle("export-all", async function (event, arg) {
  try {
    const exportKey = arg[0];

    if (!mainWindow) {
      return;
    }

    const pathToSave = dialog.showSaveDialogSync(mainWindow, {
      title: "Export to file",
      defaultPath: "noterBase-export-" + new Date().getTime() + ".txt",
    });

    const allNotesQuery = new Promise((res) => {
      db.all("SELECT * FROM notes", (err, rows) => {
        res(rows);
      });
    });
    const allNotes: INote[] = (await allNotesQuery) as INote[];
    console.log("first", allNotes[0]);

    if (!pathToSave || !allNotes || !allNotes.length) {
      return false;
    }

    const data = JSON.stringify({ data: allNotes, check: "noterBase" });

    // Defining password
    const passwordEnc = exportKey;
    // Defining key
    const keyEnc = crypto.scryptSync(passwordEnc, "GfG", 24);
    // Defininf iv
    const iv = Buffer.alloc(16, 0);
    // Creating cipher
    const cipher = crypto.createCipheriv(CRYPTING_ALGORYTHM, keyEnc, iv);
    const encrypted = cipher.update(data, "utf8", "hex") + cipher.final("hex");
    console.log("encrypted", encrypted.slice(0, 30) + "...");
    // save encrypted into the file to pathToSave here.

    fs.writeFileSync(pathToSave, encrypted);

    console.log("encrypion DONE");
    return true;
  } catch (err) {
    console.error(err);
    dialog.showErrorBox("Export error", "Unexpected error during the export.");
    return false;
  }
});

ipcMain.handle("import-all", async function (event, arg) {
  try {
    const importKey = arg[0];

    if (!mainWindow) {
      return;
    }

    const pathToRead = dialog.showOpenDialogSync(mainWindow, {
      title: "Import from file",
    });

    if (!pathToRead || !pathToRead.length || !importKey) {
      return false;
    }

    const encrypted = fs.readFileSync(pathToRead[0], { encoding: "utf8" });

    // Defining password
    const passwordDec = importKey;
    // Defining key
    const keyDec = crypto.scryptSync(passwordDec, "GfG", 24);
    // Defininf iv
    const iv = Buffer.alloc(16, 0);
    // Creating decipher
    const decipher = crypto.createDecipheriv(CRYPTING_ALGORYTHM, keyDec, iv);

    let decryptedData = "{}";
    try {
      const decTemp =
        decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
      decryptedData = decTemp;
    } catch (er) {
      console.log("wrong pass", er);
      dialog.showErrorBox("Import error", "Wrong fire or password.");
      return false;
    }

    let decrypted = {
      check: "",
      data: [{}] as INote[],
    };
    try {
      decrypted = JSON.parse(decryptedData);
    } catch (er) {
      console.log("wrong pass", er);
      dialog.showErrorBox("Import error", "Wrong fire or password.");
      return false;
    }
    console.log(
      "decrypted",
      decrypted.check === "noterBase"
        ? "Good: -> " + decrypted.data[0].title
        : "Bad"
    );

    const notesPlaceholders = decrypted.data
      .map(() => "(?, ?, ?, ?, ?, ?)")
      .join(", ");
    const onConflict = " ON CONFLICT(id) DO NOTHING;";
    const notesToInsert = decrypted.data.map((newNote) => [
      newNote.id,
      newNote.title,
      newNote.content,
      newNote.createdAt,
      newNote.updatedAt,
      newNote.removedAt,
    ]);
    const allNotesQuery = new Promise((res) => {
      db.all(
        "INSERT INTO notes VALUES " + notesPlaceholders + onConflict,
        notesToInsert.flat(),
        (err, rows) => {
          res(rows);
        }
      );
    });
    await allNotesQuery;

    console.log("decryption DONE");
    return true;
  } catch (err) {
    console.error(err);
    dialog.showErrorBox("Import error", "Unexpected error during the export.");
    return false;
  }
});
