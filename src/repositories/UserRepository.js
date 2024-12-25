const knex = require("../database/knex");

class UserRepository {
  async findByEmail(email) {
    const user = await knex('users')
      .where({ email })
      .first();
    return user;
  }

  async findById(id) {
    const user = await knex('users')
      .where({ id })
      .first();
    return user;
  }

  async create({ name, email, hashedPassword }) {
    const [userId] = await knex('users')
      .insert({
        name, 
        email, 
        hashedPassword
      })
      .returning('id');
    return { id: userId };
  }

  async update(user) {
    await knex('users')
      .where({ id: user.id })
      .update({
        name: user.name,
        email: user.email,
        hashedPassword: user.hashedPassword,
        avatar: user.avatar,
        updated_at: knex.fn.now()
      });

    return user;
  }
}

module.exports = UserRepository;
