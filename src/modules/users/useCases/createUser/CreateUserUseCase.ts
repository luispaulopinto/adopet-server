import { injectable, inject } from 'tsyringe';

import IHashProvider from '@shared/container/providers/HashProvider/contracts/IHashProvider';
import { EmailAlreadyInUseError } from '@modules/users/errors';
import { classToClass } from 'class-transformer';
import User from '../../infra/databases/typeorm/entities/User';

import IUserRepository from '../../infra/databases/contracts/IUserRepository';

interface IUserRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IUserRequest): Promise<User> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) throw new EmailAlreadyInUseError();

    const hashPassword = await this.hashProvider.generateHash(password);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return classToClass(user, { groups: ['create'] });
  }
}

export default CreateUserUseCase;
