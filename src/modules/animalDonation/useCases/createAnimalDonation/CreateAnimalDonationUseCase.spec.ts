import { UserNotFoundError } from '@modules/users/errors';
import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import InMemoryAnimalDonationRepository from '../../infra/databases/inMemory/InMemoryAnimalDonationRepository';
import CreateAnimalDonationUseCase from './CreateAnimalDonationUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalDonationRepository: InMemoryAnimalDonationRepository;
let fakeStorageProvider: FakeStorageProvider;
let createAnimalDonationUseCase: CreateAnimalDonationUseCase;

describe('CreateAnimalDonation UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalDonationRepository = new InMemoryAnimalDonationRepository();
    fakeStorageProvider = new FakeStorageProvider();
    createAnimalDonationUseCase = new CreateAnimalDonationUseCase(
      inMemoryUserRepository,
      inMemoryAnimalDonationRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create an animal donation', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const animalDonation = await createAnimalDonationUseCase.execute({
      files: [],
      userId: user.id,
      title: 'Titulo Doação',
      description: 'Descrição Doação',
      animalType: 'cachorro',
      animalBreed: 'vira-lata',
      age: 1,
    });

    expect(animalDonation).toHaveProperty('id');
  });

  it('should NOT be able to create an animal donation with a non-existing user', async () => {
    await expect(
      createAnimalDonationUseCase.execute({
        files: [],
        userId: 'UserId',
        title: 'Titulo Doação',
        description: 'Descrição Doação',
        animalType: 'cachorro',
        animalBreed: 'vira-lata',
        age: 1,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
