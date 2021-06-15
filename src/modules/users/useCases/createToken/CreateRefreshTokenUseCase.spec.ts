// import { UserAlreadyExistsError } from '@modules/users/errors';

import InMemoryUserTokenRepository from '@modules/users/infra/databases/inMemory/InMemoryUserTokenRepository';
import User from '@modules/users/infra/databases/typeorm/entities/User';
import { TokenType } from '@modules/users/infra/databases/typeorm/entities/UserToken';

import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

import AppError from '@shared/errors/AppError';
import CreateRefreshTokenUseCase from './CreateRefreshTokenUseCase';

let inMemoryUserTokenRepository: InMemoryUserTokenRepository;
let dateProvider: DayjsDateProvider;
let createTokenUseCase: CreateRefreshTokenUseCase;

describe('CreateRefreshToken UseCase', () => {
  beforeEach(() => {
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    dateProvider = new DayjsDateProvider();
    createTokenUseCase = new CreateRefreshTokenUseCase(
      inMemoryUserTokenRepository,
      dateProvider,
    );
  });

  it('should be able to create refresh token.', async () => {
    const user = new User();
    user.id = '123456';

    const refreshToken = await createTokenUseCase.execute({ userId: user.id });

    expect(refreshToken).toHaveProperty('token');
    expect(refreshToken.token).not.toBeNull();
    expect(refreshToken.expiresIn).not.toBeNull();
  });

  it('should be able to replace an existing refresh token with a new Refresh Token.', async () => {
    const user = new User();
    user.id = '123456';

    const refreshToken1 = await createTokenUseCase.execute({ userId: user.id });
    const refreshToken2 = await createTokenUseCase.execute({ userId: user.id });

    const refreshTokenDB = await inMemoryUserTokenRepository.findByUser(
      user.id,
    );

    expect(refreshToken2).toHaveProperty('token');
    expect(refreshToken2.token).not.toBeNull();
    expect(refreshTokenDB?.token).not.toBeNull();
    expect(refreshTokenDB?.token).not.toEqual(refreshToken1.token);
    expect(refreshTokenDB?.token).toEqual(refreshToken2.token);
    expect(refreshTokenDB?.tokenType).toEqual(TokenType.REFRESHTOKEN);
    expect(refreshToken2.token).not.toBeNull();
    expect(refreshToken2.expiresIn).not.toBeNull();
  });

  it('should create a refresh token with 30 days of expires', async () => {
    const user = new User();
    user.id = '123456';

    const refreshToken = await createTokenUseCase.execute({ userId: user.id });

    const expiresDate = dateProvider.addDays(30, dateProvider.dateNow());

    const createdAtTokenFormatted = dateProvider.formatUtcDate(
      refreshToken.createdAt,
      'YYYY-MM-DD',
    );
    const createdAtDateFormatted = dateProvider.formatUtcDate(
      dateProvider.dateNow(),
      'YYYY-MM-DD',
    );

    const expiresTokenFormatted = dateProvider.formatUtcDate(
      refreshToken.expiresIn,
      'YYYY-MM-DDTHH:mm',
    );
    const expiresDateFormatted = dateProvider.formatUtcDate(
      expiresDate,
      'YYYY-MM-DDTHH:mm',
    );

    expect(refreshToken).toHaveProperty('token');
    expect(refreshToken.token).not.toBeNull();
    expect(createdAtTokenFormatted).toEqual(createdAtDateFormatted);
    expect(expiresTokenFormatted).toEqual(expiresDateFormatted);
  });

  it('should not be able to create a refresh token without userid', async () => {
    const user = new User();

    await expect(
      createTokenUseCase.execute({ userId: user.id }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a refresh token with a token not related to the user.', async () => {
    const user = new User();
    user.id = '123456';

    await createTokenUseCase.execute({ userId: user.id });

    await expect(
      createTokenUseCase.execute({ userId: user.id, token: 'TOKEN' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
