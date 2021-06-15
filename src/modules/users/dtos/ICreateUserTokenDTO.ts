import { TokenType } from '../infra/databases/typeorm/entities/UserToken';

export default interface ICreateUserTokenDTO {
  userId: string;
  token: string;
  tokenType: TokenType;
  expiresIn: Date;
  createdAt: Date;
}
