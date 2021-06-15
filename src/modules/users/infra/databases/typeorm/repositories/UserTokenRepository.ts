import { getRepository, Repository } from 'typeorm';

import IUserTokenRepository from '@modules/users/infra/databases/contracts/IUserTokenRepository';

import ICreateUserTokenDTO from '@modules/users/dtos/ICreateUserTokenDTO';
import UserToken from '../entities/UserToken';

class UserTokenRepository implements IUserTokenRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  public async create({
    userId,
    token: refreshToken,
    tokenType,
    expiresIn,
    createdAt,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      deviceId: '00000000-0000-0000-0000-000000000000',
      userId,
      token: refreshToken,
      tokenType,
      expiresIn,
      createdAt,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.repository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async findByUser(userId: string): Promise<UserToken | undefined> {
    const userToken = await this.repository.findOne({
      where: { userId },
    });

    return userToken;
  }

  public async findByUserAndToken(
    userId: string,
    token: string,
  ): Promise<UserToken | undefined> {
    const userToken = await this.repository.findOne({
      where: { userId, token },
    });

    return userToken;
  }

  public async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.repository.delete({ userId });
  }
}

export default UserTokenRepository;
