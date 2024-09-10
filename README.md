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
