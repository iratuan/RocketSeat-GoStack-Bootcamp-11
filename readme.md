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
const bodyParser = require("body-parser")
/** Necessário para gerar os IDs no formato Unique Universal ID */
const { uuid } = require("uuidv4")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true }))

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

**Dica importante**

para fazer requisições dentro do visual code, instale a extensão **thunder client**.

Aluno: @iratuan