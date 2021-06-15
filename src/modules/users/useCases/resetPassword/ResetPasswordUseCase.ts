import { injectable, inject } from 'tsyringe';

import { UserNotFoundError } from '@modules/users/errors';

import IHashProvider from '@shared/container/providers/HashProvider/contracts/IHashProvider';
import IDateProvider from '@shared/container/providers/DateProvider/contracts/IDateProvider';

import InvalidTokenError from '@modules/users/errors/InvalidTokenError';
import IUserRepository from '../../infra/databases/contracts/IUserRepository';
import IUserTokenRepository from '../../infra/databases/contracts/IUserTokenRepository';

interface IResetPasswordRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    token,
    password,
  }: IResetPasswordRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) throw new InvalidTokenError();

    const user = await this.userRepository.findById(userToken.userId);

    if (!user) throw new UserNotFoundError();

    const tokenCreatedAt = userToken.createdAt;

    // differenceInMinutes(Date.now(), tokenCreatedAt);
    const minutesResult = this.dateProvider.compareInMinutes(
      tokenCreatedAt,
      this.dateProvider.dateNow(),
    );

    if (minutesResult >= 120) throw new InvalidTokenError();

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.update(user);
  }
}

export default ResetPasswordUseCase;
