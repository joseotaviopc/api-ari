<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Um framework <a href="http://nodejs.org" target="_blank">Node.js</a> progressivo para construir aplicações server-side eficientes e escaláveis.</p>

# API ARI

Uma API moderna e escalável para o ARI, construída com NestJS, Prisma e PostgreSQL.

## Funcionalidades

- **Autenticação** usando JWT (JSON Web Tokens)
- Registro e login de usuários
- Rotas protegidas com controle de acesso baseado em função (RBAC)
- Prisma ORM para operações de banco de dados
- Documentação da API com Swagger
- Configuração baseada em ambiente
- Validação de entrada usando class-validator
- CORS habilitado para integração com o frontend

## Pré-requisitos

- Node.js (v16 ou posterior)
- PostgreSQL (v12 ou posterior)
- npm (recomendado) ou pnpm/yarn

## Configuração do Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/your-username/ARI.git
   cd ARI
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas configurações.

4. Configure o banco de dados:
   - Garanta que o PostgreSQL está rodando
   - Crie um novo banco de dados para a aplicação
   - Atualize a `DATABASE_URL` no seu arquivo `.env` com sua string de conexão do banco de dados

5. Execute as migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run start:dev
   ```

7. A API estará disponível em `http://localhost:3000`
8. A documentação da API estará disponível em `http://localhost:3000/api`

## Autenticação

A API usa JWT (JSON Web Tokens) para autenticação. Aqui está como usar:

### Registrar um novo usuário

```http
POST /users
Content-Type: application/json

{
  "username": "testuser",
  "password": "securepassword123",
  "email": "test@example.com"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "securepassword123"
}
```

Isso retornará um token de acesso que você pode usar para autenticar solicitações subsequentes, incluindo-o no cabeçalho `Authorization`:

```
Authorization: Bearer <seu-token-jwt>
```

## Documentação

A documentação da API está disponível em `http://localhost:3000/api` quando a aplicação está em modo de desenvolvimento. Ela fornece documentação interativa onde você pode testar os endpoints da API diretamente do seu navegador.

## Banco de Dados

Este projeto usa o Prisma como ORM. Depois de fazer alterações no esquema do Prisma, você precisa executar:

```bash
npx prisma generate
npx prisma migrate dev --name your_migration_name
```

## Testes

Para executar a suite de testes:

```bash
# testes unitários
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Correção de código

```bash
# lint
npm run lint

# format code
npm run format
```

## Produção

Para construir e executar a aplicação em modo de produção:

```bash
# build
npm run build

# start production server
npm run start:prod
```

## Variáveis de Ambiente

Ver `.env.example` para todas as variáveis de ambiente disponíveis.


## Deploy

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

