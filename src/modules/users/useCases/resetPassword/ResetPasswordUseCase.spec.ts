// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import { UserNotFoundError } from '@modules/users/errors';
import DateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import dayjs from 'dayjs';
import { TokenType } from '@modules/users/infra/databases/typeorm/entities/UserToken';
import InMemoryUserRepository from '../../infra/databases/inMemory/InMemoryUserRepository';
import InMemoryUserTokenRepository from '../../infra/databases/inMemory/InMemoryUserTokenRepository';
import ResetPasswordUseCase from './ResetPasswordUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryUserTokenRepository: InMemoryUserTokenRepository;
let dateProvider: DateProvider;
let fakeHashProvider: FakeHashProvider;
let resetPasswordUseCase: ResetPasswordUseCase;

describe('ResetPassword UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    dateProvider = new DateProvider();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordUseCase = new ResetPasswordUseCase(
      inMemoryUserRepository,
      inMemoryUserTokenRepository,
      dateProvider,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const { token } = await inMemoryUserTokenRepository.create({
      userId: user.id,
      token: 'refreshToken',
      tokenType: TokenType.RESETTOKEN,
      createdAt: new Date(),
      expiresIn: new Date(),
    });

    await resetPasswordUseCase.execute({
      token,
      password: '123123',
    });

    const updatedUser = await inMemoryUserRepository.findByEmail(user.email);

    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordUseCase.execute({
        token: 'non-existing token',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await inMemoryUserTokenRepository.create({
      userId: 'user.id',
      token: 'refreshToken',
      tokenType: TokenType.RESETTOKEN,
      createdAt: new Date(),
      expiresIn: new Date(),
    });

    await expect(
      resetPasswordUseCase.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should not be able to reset the password after 2 hours', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    // jest.spyOn(Date, 'now').mockImplementationOnce(() => {
    //   const customDate = new Date();
    //   return customDate.setMinutes(customDate.getMinutes() + 121);
    // });

    const { token } = await inMemoryUserTokenRepository.create({
      userId: user.id,
      token: 'refreshToken',
      tokenType: TokenType.RESETTOKEN,
      createdAt: new Date(),
      expiresIn: new Date(),
    });

    const mockDate = dateProvider.addMinutes(120);

    // const mockDate = new Date(
    //   new Date().getFullYear(),
    //   new Date().getMonth(),
    //   new Date().getDate(),
    //   new Date().getHours(),
    //   new Date().getMinutes() + 122,
    // );

    // jest
    // .spyOn(global, 'Date')
    // .mockImplementationOnce(() => (mockDate as unknown) as string);

    jest
      .spyOn(dateProvider, 'dateNow')
      .mockImplementationOnce(() => dayjs(mockDate).toDate());

    await expect(
      resetPasswordUseCase.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
