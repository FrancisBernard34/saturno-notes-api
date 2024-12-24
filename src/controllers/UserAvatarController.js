const AppError = require('../utils/AppError');

class UserAvatarController {
  constructor(userRepository = null, diskStorage = null) {
    const UserRepository = require('../repositories/UserRepository');
    const DiskStorage = require('../providers/DiskStorage');
    
    this.userRepository = userRepository || new UserRepository();
    this.diskStorage = diskStorage || new DiskStorage();
  }

  async update(request, response) {
    const user_id = request.user.id;
    const avatarFilename = request.file.filename;

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('Somente usuários autenticados podem mudar o avatar', 401);
    }

    if(user.avatar) {
      await this.diskStorage.deleteFile(user.avatar);
    }

    const filename = await this.diskStorage.saveFile(avatarFilename);
    user.avatar = filename;

    await this.userRepository.update(user);

    return response.json(user);
  }
}

module.exports = UserAvatarController;