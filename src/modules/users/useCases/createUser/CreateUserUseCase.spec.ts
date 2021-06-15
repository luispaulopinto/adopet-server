import { EmailAlreadyInUseError } from '@modules/users/errors';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import InMemoryUserRepository from '../../infra/databases/inMemory/InMemoryUserRepository';
import CreateUserUseCase from './CreateUserUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUserUseCase: CreateUserUseCase;

describe('CreateUser UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with an already exists email', async () => {
    await createUserUseCase.execute({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await expect(
      createUserUseCase.execute({
        name: 'Teste',
        email: 'teste@teste.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });
});
