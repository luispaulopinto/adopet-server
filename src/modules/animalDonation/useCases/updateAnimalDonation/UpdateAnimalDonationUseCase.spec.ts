import AnimalDonationNotFoundError from '@modules/animalDonation/errors/AnimalDonationNotFoundError';
import AnimalDonation from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalDonation';
import { UserNotFoundError } from '@modules/users/errors';
import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';
import User from '@modules/users/infra/databases/typeorm/entities/User';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import InMemoryAnimalDonationRepository from '../../infra/databases/inMemory/InMemoryAnimalDonationRepository';
import UpdateAnimalDonationUseCase from './UpdateAnimalDonationUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalDonationRepository: InMemoryAnimalDonationRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateAnimalDonationUseCase: UpdateAnimalDonationUseCase;

let user: User;
let animal: AnimalDonation;

describe('Update Animal Donation Use Case', () => {
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalDonationRepository = new InMemoryAnimalDonationRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateAnimalDonationUseCase = new UpdateAnimalDonationUseCase(
      inMemoryUserRepository,
      inMemoryAnimalDonationRepository,
      fakeStorageProvider,
    );

    user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    animal = await inMemoryAnimalDonationRepository.create({
      userId: user.id,
      title: 'Titulo Doação 1',
      description: 'Descrição Doação 1',
      animalType: 'cachorro 1',
      animalBreed: 'vira-lata',
      age: 1,
    });
  });

  it('should be able to update an animal donation', async () => {
    const animalDonation = await updateAnimalDonationUseCase.execute({
      files: [],
      userId: user.id,
      animalId: animal.id,
      title: 'Titulo Doação 2',
      description: 'Descrição Doação 2',
      animalType: 'cachorro 2',
      animalBreed: 'vira-lata 2',
      age: 2,
    });

    expect(animalDonation).toHaveProperty('id');
  });

  it('should NOT be able to update an non-existing animal donation', async () => {
    await expect(
      updateAnimalDonationUseCase.execute({
        files: [],
        userId: user.id,
        animalId: 'Animalid',
        title: 'Titulo Doação',
        description: 'Descrição Doação',
        animalType: 'cachorro',
        animalBreed: 'vira-lata',
        age: 1,
      }),
    ).rejects.toBeInstanceOf(AnimalDonationNotFoundError);
  });

  it('should NOT be able to update an animal donation with a non-existing user', async () => {
    await expect(
      updateAnimalDonationUseCase.execute({
        files: [],
        userId: 'UserId',
        animalId: animal.id,
        title: 'Titulo Doação',
        description: 'Descrição Doação',
        animalType: 'cachorro',
        animalBreed: 'vira-lata',
        age: 1,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should NOT be able to update an animal donation with an user that is not the donation owner', async () => {
    const user2 = await inMemoryUserRepository.create({
      name: 'Teste 2',
      email: 'teste2@teste.com.br',
      password: '123456',
      isOng: false,
    });

    await expect(
      updateAnimalDonationUseCase.execute({
        files: [],
        userId: user2.id,
        animalId: animal.id,
        title: 'Titulo Doação',
        description: 'Descrição Doação',
        animalType: 'cachorro',
        animalBreed: 'vira-lata',
        age: 1,
      }),
    ).rejects.toBeInstanceOf(AnimalDonationNotFoundError);
  });
});
