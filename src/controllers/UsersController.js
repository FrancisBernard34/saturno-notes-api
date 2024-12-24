const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");

class UsersController {
  constructor() {
    this.userRepository = new UserRepository();
    this.userCreateService = new UserCreateService(this.userRepository);
  }

  create = async (request, response) => {
    try {
      const { name, email, password } = request.body;

      if (!name || !email || !password) {
        throw new AppError("All fields are required!");
      }

      const user = await this.userCreateService.execute({ name, email, password });
      
      return response.status(201).json({
        status: "success",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      });
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        status: "error",
        message: error.message || "Internal server error"
      });
    }
  }

  update = async (request, response) => {
    const { name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError("User not found");
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

      user.hashedPassword = await hash(password, 8);
    }

    await this.userRepository.update(user);

    return response.json();
  }
}

module.exports = UsersController;
