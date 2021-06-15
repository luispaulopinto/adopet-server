import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/container/providers/StorageProvider/contracts/IStorageProvider';
import { classToClass } from 'class-transformer';
import { UserNotFoundError } from '@modules/users/errors';
import IUserRepository from '../../infra/databases/contracts/IUserRepository';

import User from '../../infra/databases/typeorm/entities/User';

interface IUpdateAvatarRequest {
  avatarFilename: string;
  userId: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    userId,
    avatarFilename,
  }: IUpdateAvatarRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundError();
    // throw new AppError('Only authenticated users can change avatar.', 401);

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = fileName;

    await this.userRepository.update(user);

    return classToClass(user, { groups: ['update'] });
  }
}

export default UpdateUserAvatarUseCase;
