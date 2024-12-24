const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');
const authConfig = require('../configs/auth');
const { sign } = require('jsonwebtoken');

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    if (!email) {
      throw new AppError('E-mail é obrigatório', 400);
    }

    const user = await knex('users')
      .where({ email: email })
      .first();

    if (!user) {
      throw new AppError('E-mail e/ou senha incorretos', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if(!passwordMatch) {
      throw new AppError('E-mail e/ou senha incorretos', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json({user, token});
  }
}

module.exports = SessionsController;
