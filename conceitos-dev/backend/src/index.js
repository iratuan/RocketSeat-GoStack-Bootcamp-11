const express = require("express");
const app = express();
const PORT = 3000;

/** Necessário para receber os dados da requisição no formato json */
const bodyParser = require("body-parser");
/** Necessário para gerar os IDs no formato Unique Universal ID */
const { uuid, isUuid } = require("uuidv4");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** Inicializa uma array de objetos para simular um banco de dados
 */
let projects = [];

/**
 * API Projects
 * GET    usado para recuperar informações, seja uma listagem completa, seja um único arquivo
 * POST   usado para criar um novo registro
 * PUT    usado para atualizar um registro
 * DELETE usado para deletar (soft ou hard)
 */

/**
 * 
 * Midleware
 * Intercepta uma requisição. Semelhante aos filtros do java. 
 * Pode interromper uma requisição, bem como, modificá-la.
 * Implementa o design patter Observer.
 */

const logRequest = (request, response, next) => {
  const { method, url } = request;
  const logText = `[${method.toUpperCase()} ${url}]`;
  console.time(logText);
  next();
  console.timeEnd(logText);
}

app.use(logRequest);

const validateFormatId = (request, response, next) => {
  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).send({code:400, data:"Esse id não é válido"});
  }
  return next();
}

app.use("/projects/:id",validateFormatId);


/**
 * Recupera todos os projetos
 * Recupera projetos com base no título informado
 * Retorna uma lista de projetos
 */
app.get("/projects", (request, response) => {
  const { title } = request.query;
 
  const results = title ? projects.filter(project => project.title.includes(title)): projects;

  return response.status(200).send({ code: 200, data: results });
});

/**
 * Cria um novo projeto
 * Retorno: um array de objetos projeto
 */
app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.status(201).send({ code: 201, data: project });
});

/**
 * Recupera um projeto existente
 * Parametro: id do tipo stringo no formato uuid
 * Retorna 404 caso não encontre um projeto com o id informado
 * Retorna 200 caso encontre o projeto com o id informado
 */
app.get("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response
      .status(404)
      .send({ code: 404, data: "Projeto não encontrado" });
  }

  const project = projects[projectIndex];
  return response.status(200).send({ code: 200, data: project });
});

/**
 * Atualiza um projeto existente
 * Parametro: id do tipo string no formato uuid
 * Retorna 200 caso encontre o projeto com o ID informado
 * Retorna 404 caso não exista um projeto com o ID informado
 */
app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;
  /** Verificando se o projeto existe */
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response
      .status(404)
      .send({ code: 404, data: "Projeto não encontrado" });
  }

  /** Criando o objeto project */
  const project = { id, title, owner };

  /** Setando o projeto na posição correta */
  projects[projectIndex] = project;

  return response.status(200).send({ code: 200, data: project });
});

/**
 * Deleta um projeto
 * Parametro: id do tipo string no formato uuid
 * Retorna 200 caso encontre o projeto com o id informado
 * Retorna 404 caso não encontre um projeto com o id informado
 */
app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;
  /** Verificando se o projeto existe */
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response
      .status(404)
      .send({ code: 404, data: "Projeto não encontrado" });
  }

  /** Removendo o elemento do array a partir do indice */
  projects.splice(projectIndex, 1);

  return response
    .status(200)
    .send({ code: 200, data: "Projeto removido com sucesso" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
