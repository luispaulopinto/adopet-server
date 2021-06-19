import { UserNotFoundError } from '@modules/users/errors';

import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';

import InMemoryAnimalDonationRepository from '@modules/animalDonation/infra/databases/inMemory/InMemoryAnimalDonationRepository';

import AnimalDonationNotFoundError from '@modules/animalDonation/errors/AnimalDonationNotFoundError';
import ShowAnimalDonationUseCase from './ShowAnimalDonationUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalDonationRepository: InMemoryAnimalDonationRepository;
let showAnimalDonationUseCase: ShowAnimalDonationUseCase;

describe('Show Animal Donation UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalDonationRepository = new InMemoryAnimalDonationRepository();
    showAnimalDonationUseCase = new ShowAnimalDonationUseCase(
      inMemoryUserRepository,
      inMemoryAnimalDonationRepository,
    );
  });

  it('should be able to show animal donation', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const donation = await inMemoryAnimalDonationRepository.create({
      userId: user.id,
      title: 'Titulo Doação 1',
      description: 'Descrição Doação 1',
      animalType: 'cachorro 1',
      animalBreed: 'vira-lata',
      age: 1,
    });

    const animal = await showAnimalDonationUseCase.execute({
      userId: user.id,
      donationId: donation.id,
    });

    expect(animal).toHaveProperty('id');
    expect(animal.title).toBe('Titulo Doação 1');
  });

  it('should NOT be able to show animal for donation from a non-existing user.', async () => {
    expect(
      showAnimalDonationUseCase.execute({
        userId: 'non-exixting user',
        donationId: 'donation.id',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should NOT be able to show animal for donation from a non-existing donation.', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    expect(
      showAnimalDonationUseCase.execute({
        userId: user.id,
        donationId: 'donation.id',
      }),
    ).rejects.toBeInstanceOf(AnimalDonationNotFoundError);
  });
});
