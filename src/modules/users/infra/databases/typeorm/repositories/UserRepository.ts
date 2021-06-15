import { getRepository, Repository } from 'typeorm';

import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { id },
    });
    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      select: ['id', 'email', 'name', 'avatar', 'password'],
      where: { email },
    });

    return user;
  }

  public async create(userDTO: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userDTO);

    await this.ormRepository.save(user);

    return user;
  }

  public async update(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UserRepository;
