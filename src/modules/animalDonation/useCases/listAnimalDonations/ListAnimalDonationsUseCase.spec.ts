import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';

import InMemoryAnimalDonationRepository from '@modules/animalDonation/infra/databases/inMemory/InMemoryAnimalDonationRepository';

import ListAnimalDonationsUseCase from './ListAnimalDonationsUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalDonationRepository: InMemoryAnimalDonationRepository;
let listAnimalDonationByUserUseCase: ListAnimalDonationsUseCase;

describe('List Animal Feeds Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalDonationRepository = new InMemoryAnimalDonationRepository();
    listAnimalDonationByUserUseCase = new ListAnimalDonationsUseCase(
      inMemoryAnimalDonationRepository,
    );
  });

  it('should be able to list animals feeds', async () => {
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

    await inMemoryAnimalDonationRepository.create({
      userId: user.id,
      title: 'Titulo Doação 2',
      description: 'Descrição Doação 2',
      animalType: 'cachorro 2',
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

    await inMemoryAnimalDonationRepository.create({
      userId: user.id,
      title: 'Titulo Doação 2',
      description: 'Descrição Doação 2',
      animalType: 'cachorro 2',
      animalBreed: 'vira-lata',
      age: 1,
    });

    const userAnimals = await listAnimalDonationByUserUseCase.execute({
      limit: 2,
      page: 2,
      baseUrl: '/',
    });

    expect(userAnimals.total).toBe(5);
    expect(userAnimals.page).toBe(2);
    expect(userAnimals.pageCount).toBe(3);
    expect(userAnimals.limit).toBe(2);
    expect(userAnimals.results).not.toBeNull();
    expect(userAnimals.results.length).toBe(5);
    expect(userAnimals.links).not.toBeNull();
    expect(userAnimals.links?.self).not.toBeNull();
    expect(userAnimals.links?.first).not.toBeNull();
    expect(userAnimals.links?.previous).not.toBeNull();
    expect(userAnimals.links?.next).not.toBeNull();
    expect(userAnimals.links?.last).not.toBeNull();
  });
});
