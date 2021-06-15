import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import crypto from 'crypto';
import IUserTokenRepository from '@modules/users/infra/databases/contracts/IUserTokenRepository';
import IDateProvider from '@shared/container/providers/DateProvider/contracts/IDateProvider';

import { InvalidTokenError, UserNotFoundError } from '@modules/users/errors';

import UserToken, {
  TokenType,
} from '@modules/users/infra/databases/typeorm/entities/UserToken';

interface ITokenRequest {
  userId: string;
  token?: string;
}

interface ITokenResponse {
  token: string;
  createdAt: Date;
  expiresIn: Date;
}

@injectable()
class CreateRefreshTokenUseCase {
  constructor(
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  public async execute({
    userId,
    token,
  }: ITokenRequest): Promise<ITokenResponse> {
    if (!userId) throw new UserNotFoundError();

    let userToken: UserToken | undefined;

    if (token) {
      userToken = await this.userTokenRepository.findByUserAndToken(
        userId,
        token,
      );

      if (!userToken) throw new InvalidTokenError();
    }

    await this.userTokenRepository.deleteByUserId(userId);

    const { expiresRefreshTokenDays } = authConfig.token;

    const newToken = crypto.randomBytes(40).toString('hex');

    const createdAt = this.dateProvider.dateNow();
    const expiresIn = this.dateProvider.addDays(
      expiresRefreshTokenDays,
      createdAt,
    );

    await this.userTokenRepository.create({
      userId,
      token: newToken,
      tokenType: TokenType.REFRESHTOKEN,
      createdAt,
      expiresIn,
    });

    return {
      token: newToken,
      createdAt,
      expiresIn,
    };
  }
}

export default CreateRefreshTokenUseCase;
