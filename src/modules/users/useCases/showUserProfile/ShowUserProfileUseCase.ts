import { injectable, inject } from 'tsyringe';

import { classToClass } from 'class-transformer';

import User from '../../infra/databases/typeorm/entities/User';

import IUserRepository from '../../infra/databases/contracts/IUserRepository';
import UserNotFoundError from '../../errors/UserNotFoundError';

interface IUserIdRequest {
  userId: string;
}

@injectable()
class ShowUserProfileUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ userId }: IUserIdRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundError();

    return classToClass(user, { groups: ['profile'] });
  }
}

export default ShowUserProfileUseCase;
