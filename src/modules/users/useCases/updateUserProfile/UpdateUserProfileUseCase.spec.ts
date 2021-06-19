import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import InMemoryUserRepository from '../../infra/databases/inMemory/InMemoryUserRepository';
import UpdateUserProfileUseCase from './UpdateUserProfileUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserProfileUseCase: UpdateUserProfileUseCase;

describe('UpdateUserProfile Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUserProfileUseCase = new UpdateUserProfileUseCase(
      inMemoryUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const updatedUser = await updateUserProfileUseCase.execute({
      userId: user.id,
      name: 'Teste 2',
      email: 'teste2@teste.com.br',
      uf: 'SP',
      city: 'São Paulo',
    });

    expect(updatedUser.name).toBe('Teste 2');
    expect(updatedUser.email).toBe('teste2@teste.com.br');
    expect(updatedUser.uf).toBe('SP');
    expect(updatedUser.city).toBe('São Paulo');
  });

  it('should be able to update the profile with same email.', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const updatedUser = await updateUserProfileUseCase.execute({
      userId: user.id,
      name: 'Teste 2',
      email: 'teste@teste.com.br',
    });

    expect(updatedUser.name).toBe('Teste 2');
    expect(updatedUser.email).toBe('teste@teste.com.br');
  });

  it('should be able to update the profile password.', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const compareHash = jest.spyOn(fakeHashProvider, 'compareHash');
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const updatedUser = await updateUserProfileUseCase.execute({
      userId: user.id,
      name: 'Teste 2',
      email: 'teste@teste.com.br',
      oldPassword: '123456',
      password: '123123',
    });

    const userData = await inMemoryUserRepository.findById(updatedUser.id);

    expect(userData?.password).toBe('123123');
    expect(compareHash).toBeCalledWith('123456', '123456');
    expect(generateHash).toBeCalledWith('123123');
  });

  it('should not be able to update the profile without an old password.', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    await expect(
      updateUserProfileUseCase.execute({
        userId: user.id,
        name: 'Teste 2',
        email: 'teste@teste.com.br',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile with a wrong old password.', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const compareHash = jest.spyOn(fakeHashProvider, 'compareHash');

    await expect(
      updateUserProfileUseCase.execute({
        userId: user.id,
        name: 'Teste 2',
        email: 'teste@teste.com.br',
        oldPassword: '123123',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
    expect(compareHash).toBeCalledWith('123123', '123456');
  });

  it('should not be able to update the profile with a non existing user.', async () => {
    await expect(
      updateUserProfileUseCase.execute({
        userId: 'user.id',
        name: 'Teste 2',
        email: 'teste2@teste.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile with an already existing email.', async () => {
    await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const user = await inMemoryUserRepository.create({
      name: 'Teste 2',
      email: 'teste2@teste.com.br',
      password: '123456',
      isOng: false,
    });

    await expect(
      updateUserProfileUseCase.execute({
        userId: user.id,
        name: 'Teste',
        email: 'teste@teste.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
