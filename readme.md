# Treinamento RocketSeat - GoStack 11

**Dicas**

Instale o Yarn através do comando

```shell
npm install --global yarn
```

Após isso, caso esteja no windows, garanta que o script tem permissão para rodar através do comando

```shell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
```



### Criando o projeto backend

Dentro da pasta de estudos, crie o diretório /conceitos-dev/backend. Dentro da pasta backend, execute o seguinte comando:

```shell
yarn init -y
```

e note o arquivo package.json que foi criado.

Crie agora uma pasta chamada src e dentro dela crie um arquivo index.js.

Após isso, instale o express através do comando yarn add express.

Dentro do arquivo index.js escreva o seguinte código

```javascript
const express = require("express");
const app = express();
const PORT = 3000;

app.get("/projects", (request, response) => {
  response.status(200).send({ code: 200, data: "Ola mundo" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

```

e rode o comando através de node index.js e acesse, no browser, o endereço http://localhost:3000/projects

**Instalando o nodemon (para refresh automático)**

```shell
yarn add nodemon -D
```

Altere o arquivo package.json para

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
}

```

Suba o servidor através do comando **yarn dev**

Note que agora o servidor **escuta** as alterações.

Adicione agora uma nova dependência para o nosso projeto através do comando **yarn add uuidv4**. Essa dependência irá criar campos de ID para nós.

Adicione também a dependência **body-parser** que será responsável por **receber** os dados no formato json.

Abaixo segue a implementação da nossa API

```javascript
const express = require("express");
const app = express();
const PORT = 3000;

/** Necessário para receber os dados da requisição no formato json */
const bodyParser = require("body-parser");
/** Necessário para gerar os IDs no formato Unique Universal ID */
const { uuid } = require("uuidv4");

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

```

E seu arquivo package.json deve estar semelhante a esse:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/index.js",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon"
  },
  "dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "uuidv4": "^6.2.11"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
}

```

### Criando um midleware para logar nossa API

Crie a seguinte funcion dentro de index.js

```javascript
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
```

Note que pedimos ao express para utilizar a funcion criada. Dessa forma, toda vez que fizermos alguma requisição, o Método e a URL solicitada serão impressos no console.

### Criando um novo midleware para validar o formato do ID

```javascript
const validateFormatId = (request, response, next) => {
  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).send({code:400, data:"Esse id não é válido"});
  }
  return next();
}

app.use("/projects/:id",validateFormatId);
```

Dessa forma, o express vai interceptar as rotas no formato **/projects/<id>** e aplicar o midleware de validação

**Dica importante**

para fazer requisições dentro do visual code, instale a extensão **thunder client**.

Aluno: @iratuan