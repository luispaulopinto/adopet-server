import { injectable, inject } from 'tsyringe';

import { classToClass } from 'class-transformer';

import IHashProvider from '@shared/container/providers/HashProvider/contracts/IHashProvider';

import { IncorrectEmailOrPasswordError } from '@modules/users/errors';

import IUserRepository from '../../infra/databases/contracts/IUserRepository';
import User from '../../infra/databases/typeorm/entities/User';

interface IAuthRequest {
  email: string;
  password: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IAuthRequest): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new IncorrectEmailOrPasswordError();

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) throw new IncorrectEmailOrPasswordError();

    return classToClass(user);
  }
}

export default AuthenticateUserUseCase;
