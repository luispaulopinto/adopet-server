// import { UserAlreadyExistsError } from '@modules/users/errors';

import User from '@modules/users/infra/databases/typeorm/entities/User';

import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import JwtProvider from '@shared/container/providers/JwtProvider/implementations/JwtProvider';

import AppError from '@shared/errors/AppError';

import CreateAccessTokenUseCase from './CreateAccessTokenUseCase';

let dateProvider: DayjsDateProvider;
let jwtProvider: JwtProvider;

let createAccessTokenUseCase: CreateAccessTokenUseCase;

interface IToken {
  data: {
    name: string;
    email: string;
  };
  iat: number;
  exp: number;
  sub: string;
}

describe('CreateAccessToken UseCase', () => {
  beforeEach(() => {
    jwtProvider = new JwtProvider();
    dateProvider = new DayjsDateProvider();
    createAccessTokenUseCase = new CreateAccessTokenUseCase(jwtProvider);
  });

  it('should be able to create access token', async () => {
    const user = new User();
    user.id = '123456';
    user.name = 'Teste';
    user.email = 'teste@teste.com.br';

    const data = await createAccessTokenUseCase.execute({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    expect(data).toHaveProperty('token');
    expect(data.token).not.toBeNull();
    expect(data.expiresIn).not.toBeNull();
  });

  it('should create an access token with 15 minutes of expires', async () => {
    const user = new User();
    user.id = '123456';
    user.name = 'Teste';
    user.email = 'teste@teste.com.br';

    const accessToken = await createAccessTokenUseCase.execute({
      userId: user.id,
      name: user.name,
      email: user.email,
    });
    const decodedToken = jwtProvider.verify(accessToken.token) as IToken;

    const expiresDate = dateProvider.dateNow(decodedToken.exp * 1000);
    const issuedAtDate = dateProvider.dateNow(decodedToken.iat * 1000);

    const diffInMinutes = dateProvider.compareInMinutes(
      issuedAtDate,
      expiresDate,
    );

    expect(accessToken.expiresIn).toEqual('15m');
    expect(decodedToken.data.name).toEqual(user.name);
    expect(decodedToken.data.email).toEqual(user.email);
    expect(decodedToken.sub).toEqual(user.id);
    expect(diffInMinutes).toEqual(15);
  });

  it('should not be able to create a token without user id', async () => {
    const user = new User();
    user.name = 'Teste';
    user.email = 'teste@teste.com.br';

    await expect(
      createAccessTokenUseCase.execute({
        userId: '',
        name: user.name,
        email: user.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a token without user email', async () => {
    const user = new User();
    user.id = '123456';
    user.name = 'Teste';

    await expect(
      createAccessTokenUseCase.execute({
        userId: user.id,
        name: user.name,
        email: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a token without user name', async () => {
    const user = new User();
    user.id = '123456';
    user.email = 'teste@teste.com.br';

    await expect(
      createAccessTokenUseCase.execute({
        userId: user.id,
        name: '',
        email: user.email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
