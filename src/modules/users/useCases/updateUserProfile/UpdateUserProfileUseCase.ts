import { injectable, inject } from 'tsyringe';

import IHashProvider from '@shared/container/providers/HashProvider/contracts/IHashProvider';

import {
  EmailAlreadyInUseError,
  InvalidPasswordError,
  OldPasswordNotInformedError,
  UserNotFoundError,
} from '@modules/users/errors';

import { classToClass } from 'class-transformer';

import User from '../../infra/databases/typeorm/entities/User';

import IUserRepository from '../../infra/databases/contracts/IUserRepository';

interface IUpdateProfileRequest {
  userId: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
  uf?: string;
  city?: string;
}

@injectable()
class UpdateUserProfileUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
    oldPassword,
    password,
    uf,
    city,
  }: IUpdateProfileRequest): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundError();

    if (password) {
      if (!oldPassword) throw new OldPasswordNotInformedError();

      const isPasswordValid = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );

      if (!isPasswordValid) throw new InvalidPasswordError();

      user.password = await this.hashProvider.generateHash(password);
    }

    const userEmailExists = await this.userRepository.findByEmail(email);

    if (userEmailExists && userEmailExists.id !== userId)
      throw new EmailAlreadyInUseError();

    user.name = name;
    user.email = email;

    if (uf) user.uf = uf;
    if (city) user.city = city;

    const userUpdated = await this.userRepository.update(user);

    return classToClass(userUpdated, { groups: ['update'] });
  }
}

export default UpdateUserProfileUseCase;
