# Gerenciador de Tarefas API

Este projeto é uma API para gerenciar tarefas e usuários, construída utilizando **Node.js** e **Express.js**. Inclui funcionalidades de registro, login, criação, edição, e exclusão de tarefas, além de gerenciamento de usuários.

## Índice

- [Instalação](#instalação)
- [Uso](#uso)
- [Rotas](#rotas)
  - [Registro e Login](#registro-e-login)
  - [Gerenciamento de Tarefas](#gerenciamento-de-tarefas)
  - [Gerenciamento de Usuários](#gerenciamento-de-usuários)
- [Middleware de Autenticação](#middleware-de-autenticação)
- [Exemplo de Requisição](#exemplo-de-requisição)

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/usuario/projeto.git
   ```

2. Instale as dependências:

   ```bash
   cd projeto
   npm install
   ```

3. Execute o projeto:
   ```bash
   npm start
   ```

## Uso

Após iniciar o servidor, a API estará disponível em `http://localhost:3000`.

## Rotas

### Registro e Login

#### `POST /register`

- **Descrição**: Registra um novo usuário.
- **Corpo da Requisição**:
  ```json
  {
    "username": "exemplo",
    "password": "senha"
  }
  ```

#### `POST /login`

- **Descrição**: Realiza o login do usuário e retorna um token JWT.
- **Corpo da Requisição**:
  ```json
  {
    "username": "exemplo",
    "password": "senha"
  }
  ```

### Gerenciamento de Tarefas

Todas as rotas abaixo exigem autenticação. O token JWT deve ser enviado no cabeçalho da requisição.

#### `POST /tasks`

- **Descrição**: Cria uma nova tarefa.
- **Corpo da Requisição**:
  ```json
  {
    "title": "Título da tarefa",
    "description": "Descrição da tarefa"
  }
  ```

#### `GET /tasks`

- **Descrição**: Retorna todas as tarefas do usuário autenticado.

#### `PUT /tasks/:id`

- **Descrição**: Atualiza uma tarefa existente.
- **Parâmetros**:
  - `id`: ID da tarefa a ser atualizada.
- **Corpo da Requisição**:
  ```json
  {
    "title": "Novo título",
    "description": "Nova descrição"
  }
  ```

#### `DELETE /tasks/:id`

- **Descrição**: Exclui uma tarefa existente.
- **Parâmetros**:
  - `id`: ID da tarefa a ser excluída.

### Gerenciamento de Usuários

#### `GET /users`

- **Descrição**: Retorna todos os usuários cadastrados (rota administrativa).

#### `DELETE /users`

- **Descrição**: Exclui um usuário específico.

## Middleware de Autenticação

O middleware `authenticate` protege as rotas de tarefas e de usuários, exigindo que o usuário envie um token JWT válido no cabeçalho da requisição:

- **Cabeçalho de Autorização**:
  ```
  Authorization: Bearer <token>
  ```

## Exemplo de Requisição

### Registro de Usuário (POST /register)

```bash
curl -X POST http://localhost:3000/register \
     -H "Content-Type: application/json" \
     -d '{"username": "exemplo", "password": "senha"}'
```

### Criação de Tarefa (POST /tasks)

```bash
curl -X POST http://localhost:3000/tasks \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"title": "Nova Tarefa", "description": "Descrição da tarefa"}'
```


# Passo a Passo para Configuração do Servidor Node.js com MongoDB e AWS

## 1. Preparação do Ambiente

### 1.1. Conectar ao Servidor AWS

1. Acesse seu servidor Ubuntu na AWS via SSH:

   ```bash
   ssh -i /path/to/your-key.pem ubuntu@your-server-ip
   ```

### 1.2. Instalar Dependências

1. Atualize o sistema e instale o Node.js e npm:

   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   ```

2. Instale o PM2 para gerenciar o processo Node.js:

   ```bash
   sudo npm install -g pm2
   ```

## 2. Configuração do Projeto Node.js

### 2.1. Configurar o Projeto

1. Navegue até o diretório do projeto:

   ```bash
   cd /home/ubuntu/todo-back
   ```

2. Instale as dependências do projeto:

   ```bash
   npm install
   ```

### 2.2. Configurar o Swagger

1. Instale as dependências do Swagger:

   ```bash
   npm install swagger-jsdoc swagger-ui-express
   ```

2. Adicione a configuração do Swagger no arquivo `src/routes.js`:

   ```javascript
   const swaggerJsDoc = require('swagger-jsdoc');
   const swaggerUi = require('swagger-ui-express');

   const swaggerOptions = {
     swaggerDefinition: {
       openapi: '3.0.0',
       info: {
         title: 'Task Manager API',
         version: '1.0.0',
         description: 'API para gerenciar tarefas e usuários',
         contact: {
           name: 'Seu Nome'
         },
         servers: [
           {
             url: 'http://localhost:3000',
             description: 'Servidor Local'
           }
         ]
       },
       components: {
         securitySchemes: {
           bearerAuth: {
             type: 'http',
             scheme: 'bearer',
             bearerFormat: 'JWT',
           },
         },
       },
       security: [
         {
           bearerAuth: [],
         },
       ],
     },
     apis: ['./src/routes.js'],
   };

   const swaggerDocs = swaggerJsDoc(swaggerOptions);
   router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
   ```

### 2.3. Configurar Variáveis de Ambiente

1. Crie o arquivo `.env`:

   ```bash
   nano .env
   ```

2. Adicione suas variáveis de ambiente no arquivo `.env`:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
   PORT=443
   ```

3. Salve com ctrl + s e feche o arquivo com ctrl + x `.env`.


### 2.4. Configurar o Servidor Express

1. No arquivo `index.js`, certifique-se de que o servidor está configurado para escutar na porta correta e ler variáveis de ambiente:

   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   require('dotenv').config();

   const app = express();
   const PORT = process.env.PORT || 3000;

   // Configurar o middleware e rotas
   app.use(express.json());
   app.use('/api', require('./src/routes'));

   mongoose.connect(process.env.MONGO_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   }).then(() => {
     console.log('Conectado ao MongoDB');
     app.listen(PORT, () => {
       console.log(`Servidor rodando na porta ${PORT}`);
     });
   }).catch(err => {
     console.error('Erro ao conectar ao MongoDB', err);
   });
   ```

## 3. Configuração do MongoDB

### 3.1. Habilitar Conexões de Qualquer IP

1. No MongoDB Atlas, vá até a seção de IP Whitelist e adicione o IP `0.0.0.0/0` para permitir conexões de qualquer IP.

2. Configure o MongoDB para permitir conexões externas, se necessário.

## 4. Configuração do Bucket AWS

### 4.1. Criar um Bucket

1. Acesse o Console da AWS e vá para o Amazon S3.
2. Crie um novo bucket com um nome único e selecione a região desejada.
3. Configure permissões de acesso para o bucket. Para testes, você pode configurar o bucket para acesso público, mas no futuro, restrinja o acesso apenas ao seu app front-end Angular.

## 5. Iniciar o Servidor

### 5.1. Iniciar o Servidor com PM2

1. Inicie o servidor Node.js com o PM2:

   ```bash
   pm2 start index.js --name "todo-back"
   ```

2. Verifique o status do servidor:

   ```bash
   pm2 status
   ```

3. Para garantir que o PM2 reinicie o servidor após um reinício do sistema:

   ```bash
   pm2 startup
   pm2 save
   ```
