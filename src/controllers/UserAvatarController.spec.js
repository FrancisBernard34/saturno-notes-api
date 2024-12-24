const UserAvatarController = require('./UserAvatarController');
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory');
const DiskStorageInMemory = require('../providers/DiskStorageInMemory');
const AppError = require('../utils/AppError');

describe('UserAvatarController', () => {
  let userAvatarController;
  let userRepository;
  let diskStorage;
  let request;
  let response;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    diskStorage = new DiskStorageInMemory();
    userAvatarController = new UserAvatarController(userRepository, diskStorage);

    response = {
      json: jest.fn()
    };
  });

  it('should be able to update user avatar', async () => {
    const user = await userRepository.create({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    });

    request = {
      user: { id: user.id },
      file: { filename: 'test-avatar.jpg' }
    };

    await userAvatarController.update(request, response);

    const updatedUser = await userRepository.findById(user.id);
    expect(updatedUser.avatar).toBe('test-avatar.jpg');
    expect(response.json).toHaveBeenCalledWith(updatedUser);
  });

  it('should delete old avatar when updating to new avatar', async () => {
    const user = await userRepository.create({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      avatar: 'old-avatar.jpg'
    });

    request = {
      user: { id: user.id },
      file: { filename: 'new-avatar.jpg' }
    };

    await userAvatarController.update(request, response);

    const updatedUser = await userRepository.findById(user.id);
    expect(updatedUser.avatar).toBe('new-avatar.jpg');
    expect(diskStorage.files.has('old-avatar.jpg')).toBeFalsy();
  });

  it('should not update avatar of non-existing user', async () => {
    request = {
      user: { id: 999 },
      file: { filename: 'test-avatar.jpg' }
    };

    await expect(
      userAvatarController.update(request, response)
    ).rejects.toEqual(new AppError('Somente usuários autenticados podem mudar o avatar', 401));
  });
});
