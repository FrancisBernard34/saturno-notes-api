const UsersController = require('./UsersController');
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory');
const UserCreateService = require('../services/UserCreateService');
const AppError = require('../utils/AppError');

describe("UsersController", () => {
  let usersController;
  let userRepository;
  let userCreateService;
  let request;
  let response;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    userCreateService = new UserCreateService(userRepository);
    usersController = new UsersController(userRepository, userCreateService);

    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe("create", () => {
    it("should create a new user", async () => {
      request = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "123456"
        }
      };

      await usersController.create(request, response);

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.json).toHaveBeenCalled();
    });

    it("should not create user with existing email", async () => {
      const existingUser = {
        name: "Existing User",
        email: "test@example.com",
        password: "123456"
      };

      await userRepository.create(existingUser);

      request = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "123456"
        }
      };

      await expect(
        usersController.create(request, response)
      ).rejects.toEqual(new AppError("User already exists!"));
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      // Create a test user before each update test
      const user = {
        name: "Test User",
        email: "test@example.com",
        password: "123456"
      };
      await userRepository.create(user);
    });

    it("should update user information", async () => {
      request = {
        body: {
          name: "Updated Name",
          email: "updated@example.com"
        },
        user: {
          id: 1
        }
      };

      await usersController.update(request, response);
      const updatedUser = await userRepository.findById(1);

      expect(updatedUser.name).toBe("Updated Name");
      expect(updatedUser.email).toBe("updated@example.com");
    });

    it("should throw error when user is not found", async () => {
      request = {
        body: {},
        user: {
          id: 999
        }
      };

      await expect(
        usersController.update(request, response)
      ).rejects.toEqual(new AppError("User not found!"));
    });

    it("should throw error when trying to update password without old password", async () => {
      request = {
        body: {
          password: "newpassword"
        },
        user: {
          id: 1
        }
      };

      await expect(
        usersController.update(request, response)
      ).rejects.toEqual(new AppError("Old password is required!"));
    });

    it("should throw error when old password doesn't match", async () => {
      request = {
        body: {
          password: "newpassword",
          old_password: "wrongpassword"
        },
        user: {
          id: 1
        }
      };

      await expect(
        usersController.update(request, response)
      ).rejects.toEqual(new AppError("Old password does not match!"));
    });
  });
});
