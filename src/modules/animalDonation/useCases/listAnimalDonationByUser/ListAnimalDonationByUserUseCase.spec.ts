import { UserNotFoundError } from '@modules/users/errors';

import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';

import InMemoryAnimalDonationRepository from '@modules/animalDonation/infra/databases/inMemory/InMemoryAnimalDonationRepository';

import ListAnimalDonationByUserUseCase from './ListAnimalDonationByUserUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalDonationRepository: InMemoryAnimalDonationRepository;
let listAnimalDonationByUserUseCase: ListAnimalDonationByUserUseCase;

describe('List Animal Donation By User UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalDonationRepository = new InMemoryAnimalDonationRepository();
    listAnimalDonationByUserUseCase = new ListAnimalDonationByUserUseCase(
      inMemoryUserRepository,
      inMemoryAnimalDonationRepository,
    );
  });

  it('should be able to list all animals for donation by the user', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    await inMemoryAnimalDonationRepository.create({
      userId: user.id,
      title: 'Titulo Doação 1',
      description: 'Descrição Doação 1',
      animalType: 'cachorro 1',
      animalBreed: 'vira-lata',
      age: 1,
    });

    await inMemoryAnimalDonationRepository.create({
      userId: user.id,
      title: 'Titulo Doação 2',
      description: 'Descrição Doação 2',
      animalType: 'cachorro 2',
      animalBreed: 'vira-lata',
      age: 1,
    });

    const userAnimals = await listAnimalDonationByUserUseCase.execute({
      userId: user.id,
    });

    expect(userAnimals.length).toBe(2);
    expect(userAnimals[0]).toHaveProperty('id');
    expect(userAnimals[0].title).toBe('Titulo Doação 1');
    expect(userAnimals[1]).toHaveProperty('id');
    expect(userAnimals[1].title).toBe('Titulo Doação 2');
  });

  it('should NOT be able to list animals for donation from a non-existing user.', async () => {
    expect(
      listAnimalDonationByUserUseCase.execute({
        userId: 'non-exixting user',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
