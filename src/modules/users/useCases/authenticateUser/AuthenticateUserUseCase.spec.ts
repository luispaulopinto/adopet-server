import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import InMemoryUserRepository from '../../infra/databases/inMemory/InMemoryUserRepository';
import CreateUserUseCase from '../createUser/CreateUserUseCase';
import AuthenticateUserUseCase from './AuthenticateUserUseCase';
import IncorrectEmailOrPasswordError from '../../errors/IncorrectEmailOrPasswordError';

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('AuthenticateUser UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserUseCase = new CreateUserUseCase(
      inMemoryUserRepository,
      fakeHashProvider,
    );

    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate an existing user', async () => {
    const userData = {
      name: 'Test Name',
      email: 'Test Email',
      password: 'Test Password',
    };

    const userCreated = await createUserUseCase.execute(userData);

    const user = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password,
    });

    expect(user).toHaveProperty('id');
    expect(user).toEqual(userCreated);
  });

  it('should not be able to authenticate with a non-existing user', async () => {
    const userData = {
      name: 'Test Name',
      email: 'Test Email',
      password: 'Test Password',
    };

    await expect(
      authenticateUserUseCase.execute({
        email: userData.email,
        password: userData.password,
      }),
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    const userData = {
      name: 'Test Name',
      email: 'Test Email',
      password: 'Test Password',
    };

    await createUserUseCase.execute(userData);

    await expect(
      authenticateUserUseCase.execute({
        email: userData.email,
        password: 'wrong password',
      }),
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
