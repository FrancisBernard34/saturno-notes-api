const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");

class UsersController {
  /* 
  index - GET para listar vários registros
  show - GET para listar um único registro
  create - POST para criar um novo registro
  update - PUT para atualizar um registro
  delete - DELETE para deletar um registro
  */
  async create(request, response) {
    const { name, email, password } = request.body;

    const userRepository = new UserRepository();
    const userCreateService = new UserCreateService(userRepository);

    await userCreateService.execute({ name, email, password });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = ?", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("User not found!");
    }

    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Email already in use!");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Old password is required!");
    }

    if (old_password && password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("Old password does not match!");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      "UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now') WHERE id = ?",
      [user.name, user.email, user.password, user_id]
    );

    return response.json();
  }
}

module.exports = UsersController;
