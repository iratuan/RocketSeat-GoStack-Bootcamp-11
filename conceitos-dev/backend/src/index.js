const express = require("express");
const app = express();
const PORT = 3000;

app.get("/projects", (request, response) => {
  response.status(200).send({ code: 200, data: "Hello gostack. Dev Iratuan" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
