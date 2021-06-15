import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import InMemoryUserRepository from '../../infra/databases/inMemory/InMemoryUserRepository';
import UpdateUserAvatarUseCase from './UpdateUserAvatarUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

describe('UpdateAvatar UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
      inMemoryUserRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create an user avatar', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await updateUserAvatarUseCase.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should NOT be able to update an user avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    await updateUserAvatarUseCase.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatarUseCase.execute({
      userId: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });

  it('should NOT be able to update avatar with an non existing user', async () => {
    await expect(
      updateUserAvatarUseCase.execute({
        userId: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
