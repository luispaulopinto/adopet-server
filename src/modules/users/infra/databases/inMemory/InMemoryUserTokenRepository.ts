import { v4 as uuid } from 'uuid';

import IUserTokenRepository from '@modules/users/infra/databases/contracts/IUserTokenRepository';

import ICreateUserTokenDTO from '@modules/users/dtos/ICreateUserTokenDTO';
import UserToken from '../typeorm/entities/UserToken';

class InMemoryUserTokenRepository implements IUserTokenRepository {
  private usertoken: UserToken[] = [];

  public async create({
    userId,
    token,
    tokenType,
    expiresIn: expires,
    createdAt,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token,
      tokenType,
      userId,
      expires,
      createdAt,
    });

    this.usertoken.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.usertoken.find(findToken => findToken.token === token);
  }

  async findByUser(userId: string): Promise<UserToken | undefined> {
    const userToken = this.usertoken.find(
      findToken => findToken.userId === userId,
    );
    return userToken;
  }

  async findByUserAndToken(
    userId: string,
    token: string,
  ): Promise<UserToken | undefined> {
    const userToken = this.usertoken.find(
      findToken => findToken.userId === userId && findToken.token === token,
    );
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.usertoken.find(
      findToken => findToken.id === id,
    ) as UserToken;

    this.usertoken.splice(this.usertoken.indexOf(userToken));
  }

  async deleteByUserId(userId: string): Promise<void> {
    const userToken = this.usertoken.find(
      findToken => findToken.userId === userId,
    ) as UserToken;

    this.usertoken.splice(this.usertoken.indexOf(userToken));
  }
}

export default InMemoryUserTokenRepository;
