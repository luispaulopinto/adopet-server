import AppError from '@shared/errors/AppError';
import InMemoryUserRepository from '../../infra/databases/inMemory/InMemoryUserRepository';
import ShowUserProfileUseCase from './ShowUserProfileUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('ShowUesrProfile UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
  });

  it('should be able to show the profile', async () => {
    const userData = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
    });

    const user = await showUserProfileUseCase.execute({
      userId: userData.id,
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Teste');
    expect(user.email).toBe('teste@teste.com.br');
  });

  it('should NOT be able to show the profile with an non-existing user', async () => {
    expect(
      showUserProfileUseCase.execute({
        userId: 'non-exixting user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
