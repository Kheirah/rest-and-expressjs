const express = require("express");
const postgres = require("@vercel/postgres");

const app = express();
app.use(express.json());

const notes = {
  1: { id: 1, content: "learning react" },
  2: { id: 2, content: "building a react project" },
  3: { id: 3, content: "getting to know sql" },
};
let nextId = 4;

app.get("/", async (request, response) => {
  createNotes();
  const { rows } = await postgres.sql`
    SELECT * FROM notes
  `;

  response.send(rows);
});

app.get("/:id", async (request, response) => {
  createNotes();
  const { id } = request.params;
  const { rows } = await postgres.sql`
    SELECT * FROM notes WHERE id = ${id}
  `;

  if (!rows.length) {
    return response.send([]);
  }

  response.send(rows[0]);
});

app.post("/", async (request, response) => {
  createNotes();
  const { content } = request.body;

  if (!content) {
    return response.send("Note NOT created since content is missing."); //early return
  }

  const res = await postgres.sql`
    INSERT INTO notes (content) VALUES (${content})
  `;

  if (res.rowCount > 0) {
    response.send("Successfully created the note.");
  } else {
    response.send("Could not create the note.");
  }
});

app.put("/:id", (request, response) => {
  createNotes();
  const { id } = request.params;
  const { content } = request.body;

  if (notes[id]) {
    notes[id].content = content;
    response.send(notes[id]);
  } else {
    response.status(404).send("This note does not exist.");
  }
});

app.delete("/:id", (request, response) => {
  createNotes();
  const { id } = request.params;
  if (notes[id]) {
    delete notes[id];
    response.status(204).send();
  } else {
    response.status(404).send("This note does not exist.");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

async function createNotes() {
  await postgres.sql`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      content VARCHAR(255) NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
  `;
}
