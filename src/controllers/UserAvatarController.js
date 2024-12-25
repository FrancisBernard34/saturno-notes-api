const AppError = require('../utils/AppError');
const UserRepository = require('../repositories/UserRepository');
const DiskStorage = require('../providers/DiskStorage');

class UserAvatarController {
  constructor() {
    this.userRepository = new UserRepository();
    this.diskStorage = new DiskStorage();
    this.update = this.update.bind(this);
  }

  async update(request, response) {
    try {
      const user_id = request.user.id;
      
      if (!request.file) {
        throw new AppError('Arquivo de avatar não fornecido', 400);
      }
      
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
    } catch (error) {
      console.error('Error in avatar update:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao atualizar avatar', 500);
    }
  }
}

module.exports = UserAvatarController;