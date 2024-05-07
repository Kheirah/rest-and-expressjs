const express = require("express");
const app = express();
app.use(express.json());

const notes = {};
let nextId = 1;

app.get("/", (request, response) => {
  response.send(notes);
});

app.get("/:id", (request, response) => {
  const id = request.params.id;
  if (notes[id]) {
    response.send(notes[id]);
  } else {
    response.status(404).send("This note does not exist.");
  }
});

app.post("/", (request, response) => {
  const id = nextId++;
  notes[id] = { id, note: request.body.content };
  response.send(notes[id]);
});

app.put("/:id", (request, response) => {
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
