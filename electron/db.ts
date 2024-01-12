import { Database, OPEN_CREATE } from "sqlite3";

export const dbConnect = (DB_PATH: string) => {
  console.log(DB_PATH);
  const db = new Database(DB_PATH, (err) => {
    if (err) {
      console.error(err.message);
      return;
    }

    console.log("DB connected!");
  });

  db.serialize(() => {
    db.run(
      "CREATE TABLE if not exists notes (id TEXT NOT NULL PRIMARY KEY, title TEXT, content TEXT, createdAt TEXT, updatedAt TEXT, removedAt TEXT)",
      (err) => console.log("err", err)
    );
    db.run("SELECT * FROM notes", (e: Error, r: any) => {
      if (e) {
        throw e;
      }
    });
  });

  return db;
};
