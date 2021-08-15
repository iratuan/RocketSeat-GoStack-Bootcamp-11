const express = require("express");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser")

const { uuid } = require("uuidv4")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

let projects = [];

app.get("/projects", (request, response) => {
  response.status(200).send({ code: 200, data: projects });
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  const project = {id:uuid(), title, owner}
  projects.push(project)
  response.status(201).send({ code: 201, data: project });
});

app.get("/projects/:id", (request, response) => {
  const project = projects.filter((p) => p.id === request.params.id);
  response.status(200).send({ code: 200, data: project });
});

app.put("/projects/:id", (request, response) => {
  const {id, title, owner} = request.body;
  const project = {id,title,owner};
  projects = projects.filter((p) => p.id !== request.params.id);
  projects.push(project);
  response.status(200).send({ code: 200, data: project });
});

app.delete("/projects/:id", (request, response) => {
  projects = projects.filter((p) => p.id !== request.params.id);
  response.status(200).send({ code: 200, data: "Project deleted" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
