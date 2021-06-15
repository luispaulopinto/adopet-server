import ICreateUserTokenDTO from '@modules/users/dtos/ICreateUserTokenDTO';
import UserToken from '../typeorm/entities/UserToken';

export default interface IUserTokenRepository {
  create(data: ICreateUserTokenDTO): Promise<UserToken>;

  findByToken(token: string): Promise<UserToken | undefined>;

  findByUser(userId: string): Promise<UserToken | undefined>;

  findByUserAndToken(
    userId: string,
    token: string,
  ): Promise<UserToken | undefined>;

  deleteById(id: string): Promise<void>;

  deleteByUserId(userId: string): Promise<void>;
}
