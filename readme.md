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

Aluno: @iratuan