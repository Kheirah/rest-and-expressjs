require("dotenv").config();
const express = require("express");
const postgres = require("@vercel/postgres");

const app = express();
app.use(express.json());

/* 

SQL JOINS - TODO:

Every user has multiple notes.

- [x] "/" : POST (create user) & GET (display welcome message)
- [ ] "/:user" : GET (all notes of that user) & POST (create new note)
- [ ] "/:user/:note" : GET (individual note) & PUT (change existing note) & DELETE (remove existing note)

*/

app.get("/", async (request, response) => {
  createTables();
  response.send({ message: "Welcome to the note-taking app!" });
});

app.post("/", async (request, response) => {
  createTables();
  const { username } = request.body;

  try {
    const res =
      await postgres.sql`INSERT INTO users (username) VALUES (${username})`;

    if (res.rowCount > 0) {
      response.send("User was created successfully.");
    } else {
      response.send("User could NOT be created.");
    }
  } catch (error) {
    response.send(`Something went wrong. ${error}`);
  }
});

app.get("/:user", async (request, response) => {
  createTables();
});

app.post("/:user", async (request, response) => {
  createTables();
  const { content } = request.body;
  const { user } = request.params;

  try {
    const res =
      await postgres.sql`INSERT INTO notes (content, "userId") VALUES (${content}, (SELECT id FROM users WHERE username = ${user}))`;

    if (res.rowCount > 0) {
      response.send("Note was created successfully.");
    } else {
      response.send("Note could NOT be created.");
    }
  } catch (error) {
    response.send(`Something went wrong. ${error}`);
  }
});

app.get("/:user/:note", (request, response) => {
  createTables();
});

app.put("/:user/:note", (request, response) => {
  createTables();
});

app.delete("/:user/:note", (request, response) => {
  createTables();
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

async function createTables() {
  await postgres.sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await postgres.sql`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER REFERENCES users (id) NOT NULL,
      content VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}
