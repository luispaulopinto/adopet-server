// import { UserAlreadyExistsError } from '@modules/users/errors';

import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';
import InMemoryUserTokenRepository from '@modules/users/infra/databases/inMemory/InMemoryUserTokenRepository';
import User from '@modules/users/infra/databases/typeorm/entities/User';
import { TokenType } from '@modules/users/infra/databases/typeorm/entities/UserToken';

import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

import AppError from '@shared/errors/AppError';
import CreateResetTokenUseCase from './CreateResetTokenUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryUserTokenRepository: InMemoryUserTokenRepository;
let dateProvider: DayjsDateProvider;
let createResetTokenUseCase: CreateResetTokenUseCase;

describe('CreateResetToken UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    dateProvider = new DayjsDateProvider();
    createResetTokenUseCase = new CreateResetTokenUseCase(
      inMemoryUserRepository,
      inMemoryUserTokenRepository,
      dateProvider,
    );
  });

  it('should be able to create reset token', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const resetToken = await createResetTokenUseCase.execute(user.email);

    expect(resetToken).toHaveProperty('token');
    expect(resetToken.token).not.toBeNull();
    expect(resetToken.expiresIn).not.toBeNull();
  });

  it('should be able to replace an existing reset token with a new reset Token', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const refreshToken1 = await createResetTokenUseCase.execute(user.email);

    const refreshToken2 = await createResetTokenUseCase.execute(user.email);

    const refreshTokenDB = await inMemoryUserTokenRepository.findByUser(
      user.id,
    );

    expect(refreshToken2).toHaveProperty('token');
    expect(refreshToken2.token).not.toBeNull();
    expect(refreshTokenDB?.token).not.toBeNull();
    expect(refreshTokenDB?.token).not.toEqual(refreshToken1.token);
    expect(refreshTokenDB?.token).toEqual(refreshToken2.token);
    expect(refreshTokenDB?.tokenType).toEqual(TokenType.RESETTOKEN);
    expect(refreshToken2.token).not.toBeNull();
    expect(refreshToken2.expiresIn).not.toBeNull();
  });

  it('should create a reset token with 2 hours of expires', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const resetToken = await createResetTokenUseCase.execute(user.email);

    const expiresDate = dateProvider.addHours(2, dateProvider.dateNow());

    const createdAtTokenFormatted = dateProvider.formatUtcDate(
      resetToken.createdAt,
      'YYYY-MM-DD',
    );
    const createdAtDateFormatted = dateProvider.formatUtcDate(
      dateProvider.dateNow(),
      'YYYY-MM-DD',
    );

    const expiresTokenFormatted = dateProvider.formatUtcDate(
      resetToken.expiresIn,
      'YYYY-MM-DDTHH:mm',
    );
    const expiresDateFormatted = dateProvider.formatUtcDate(
      expiresDate,
      'YYYY-MM-DDTHH:mm',
    );

    expect(resetToken).toHaveProperty('token');
    expect(resetToken.token).not.toBeNull();
    expect(createdAtTokenFormatted).toEqual(createdAtDateFormatted);
    expect(expiresTokenFormatted).toEqual(expiresDateFormatted);
  });

  it('should not be able to create a reset token without userid', async () => {
    const user = new User();

    await expect(
      createResetTokenUseCase.execute(user.email),
    ).rejects.toBeInstanceOf(AppError);
  });
});
