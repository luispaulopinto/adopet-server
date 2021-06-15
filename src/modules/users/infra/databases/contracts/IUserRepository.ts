import User from '../typeorm/entities/User';

import ICreateUserDTO from '../../../dtos/ICreateUserDTO';

export default interface IUserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  update(data: User): Promise<User>;
}
