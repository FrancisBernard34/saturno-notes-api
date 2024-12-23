# Saturno Notes API

**Saturno Notes API** é a API desenvolvida para o projeto Saturno Notes. Esta API lida com a autenticação de usuários, gerenciamento de notas e armazenamento de dados usando um banco de dados SQLite. A aplicação foi construída com o objetivo de fornecer uma interface robusta e escalável para o front-end do Saturno Notes.

## Funcionalidades

- **Autenticação de Usuário**: Realiza o login e registro de usuários utilizando JWT (JSON Web Tokens).
- **Gerenciamento de Notas**: Permite aos usuários criar, editar, excluir e listar suas notas.
- **Organização de Notas**: As notas podem ser associadas a categorias e tags.
- **Upload de Arquivos**: A API suporta o upload de arquivos através do `multer` para armazenar imagens de perfil, por exemplo.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework web para construir a API.
- **Knex**: Query builder para facilitar o acesso ao banco de dados SQLite.
- **SQLite3**: Banco de dados leve e embutido.
- **JWT (JSON Web Tokens)**: Utilizado para autenticação de usuários.
- **Bcryptjs**: Para hash de senhas e segurança da aplicação.
- **Multer**: Middleware para upload de arquivos.
- **PM2**: Gerenciamento de processos para produção.

## Instalação

Para rodar o projeto localmente, siga os seguintes passos:

1. Clone o repositório:

   ```bash
   git clone https://github.com/FrancisBernard34/saturno-notes-api.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd saturno-notes-api
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Crie o banco de dados e realize as migrações:

   ```bash
   npm run migrate
   ```

5. Execute a aplicação em modo de desenvolvimento:

   ```bash
   npm run dev
   ```

6. A API estará disponível em [http://localhost:3001](http://localhost:3001).

## Scripts

- **`npm run dev`**: Executa a API em modo de desenvolvimento com `nodemon`.
- **`npm run start`**: Executa a API em produção com `pm2`.
- **`npm run migrate`**: Executa as migrações para o banco de dados utilizando `knex`.
- **`npm run test`**: Executa os testes utilizando `jest`.

## Contribuição

Se você deseja contribuir para o projeto, sinta-se à vontade para abrir uma issue ou enviar um pull request. Seu feedback é muito bem-vindo!

## Licença

Este projeto está licenciado sob a [ISC License](LICENSE).

---

Desenvolvido por [Francis Bernard](https://github.com/FrancisBernard34)
