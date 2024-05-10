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

app.get("/", (request, response) => {
  createNotes();
  const { search } = request.query;
  if (search) {
    const filtered = Object.values(notes).filter((note) =>
      note.content.includes(search)
    );
    return response.send(filtered);
  }
  response.send(Object.values(notes));
});

app.get("/:id", (request, response) => {
  createNotes();
  const id = request.params.id;
  if (notes[id]) {
    response.send(notes[id]);
  } else {
    response.status(404).send("This note does not exist.");
  }
});

app.post("/", (request, response) => {
  createNotes();
  const id = nextId++;
  notes[id] = { id, note: request.body.content };
  response.send(notes[id]);
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
