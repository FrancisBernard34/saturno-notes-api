const sqliteConnection = require("../database/sqlite");

class UserRepository {
  async findByEmail(email) {
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE email = ?", [email]);
    return user;
  }

  async findById(id) {
    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = ?", [id]);
    return user;
  }

  async create({ name, email, hashedPassword }) {
    const database = await sqliteConnection();
    const userId = await database.run(
      "INSERT INTO users (name, email, hashedPassword) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return { id: userId };
  }

  async update(user) {
    const database = await sqliteConnection();
    await database.run(
      "UPDATE users SET name = ?, email = ?, hashedPassword = ?, avatar = ?, updated_at = DATETIME('now') WHERE id = ?",
      [user.name, user.email, user.hashedPassword, user.avatar, user.id]
    );

    return user;
  }
}

module.exports = UserRepository;
