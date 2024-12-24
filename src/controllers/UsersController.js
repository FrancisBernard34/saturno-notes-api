const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
  constructor(userRepository = null, userCreateService = null) {
    const UserRepository = require("../repositories/UserRepository");
    const UserCreateService = require("../services/UserCreateService");
    
    this.userRepository = userRepository || new UserRepository();
    this.userCreateService = userCreateService || new UserCreateService(this.userRepository);
  }

  async create(request, response) {
    const { name, email, password } = request.body;
    await this.userCreateService.execute({ name, email, password });
    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError("User not found!");
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

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

    await this.userRepository.update(user);

    return response.json();
  }
}

module.exports = UsersController;
