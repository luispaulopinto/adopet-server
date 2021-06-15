import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import crypto from 'crypto';
import IUserTokenRepository from '@modules/users/infra/databases/contracts/IUserTokenRepository';
import IDateProvider from '@shared/container/providers/DateProvider/contracts/IDateProvider';

import { TokenType } from '@modules/users/infra/databases/typeorm/entities/UserToken';
import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';
import { UserNotFoundError } from '@modules/users/errors';

interface ITokenResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
  createdAt: Date;
  expiresIn: Date;
}

@injectable()
class CreateResetTokenUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  public async execute(email: string): Promise<ITokenResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserNotFoundError();

    const userToken = await this.userTokenRepository.findByUser(user.id);

    if (userToken) {
      await this.userTokenRepository.deleteById(userToken.id);
    }

    const { expiresResetTokenHours } = authConfig.token;

    const newToken = crypto.randomBytes(40).toString('hex');

    const createdAt = this.dateProvider.dateNow();
    const expiresIn = this.dateProvider.addHours(
      expiresResetTokenHours,
      createdAt,
    );

    await this.userTokenRepository.create({
      userId: user.id,
      token: newToken,
      tokenType: TokenType.RESETTOKEN,
      createdAt,
      expiresIn,
    });

    return {
      user,
      token: newToken,
      createdAt,
      expiresIn,
    };
  }
}

export default CreateResetTokenUseCase;
