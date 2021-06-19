import AnimalDonationNotFoundError from '@modules/animalDonation/errors/AnimalDonationNotFoundError';
import AnimalDonation from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalDonation';
import { UserNotFoundError } from '@modules/users/errors';
import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';
import User from '@modules/users/infra/databases/typeorm/entities/User';
import InMemoryAnimalDonationRepository from '../../infra/databases/inMemory/InMemoryAnimalDonationRepository';
import DeleteAnimalDonationUseCase from './DeleteAnimalDonationUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalDonationRepository: InMemoryAnimalDonationRepository;
let deleteAnimalDonationUseCase: DeleteAnimalDonationUseCase;

let user: User;
let animal: AnimalDonation;

describe('Delete Animal Donation Use Case', () => {
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalDonationRepository = new InMemoryAnimalDonationRepository();
    deleteAnimalDonationUseCase = new DeleteAnimalDonationUseCase(
      inMemoryUserRepository,
      inMemoryAnimalDonationRepository,
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

  it('should be able to delete an animal donation', async () => {
    const deleteFn = jest.spyOn(inMemoryAnimalDonationRepository, 'delete');

    await deleteAnimalDonationUseCase.execute({
      userId: user.id,
      donationId: animal.id,
    });

    expect(deleteFn).toHaveBeenCalledTimes(1);
  });

  it('should NOT be able to delete an non-existing animal donation', async () => {
    await expect(
      deleteAnimalDonationUseCase.execute({
        userId: user.id,
        donationId: 'Animalid',
      }),
    ).rejects.toBeInstanceOf(AnimalDonationNotFoundError);
  });

  it('should NOT be able to delete an animal donation with a non-existing user', async () => {
    await expect(
      deleteAnimalDonationUseCase.execute({
        userId: 'UserId',
        donationId: animal.id,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should NOT be able to delete an animal donation with an user that is not the donation owner', async () => {
    const user2 = await inMemoryUserRepository.create({
      name: 'Teste 2',
      email: 'teste2@teste.com.br',
      password: '123456',
      isOng: false,
    });

    await expect(
      deleteAnimalDonationUseCase.execute({
        userId: user2.id,
        donationId: animal.id,
      }),
    ).rejects.toBeInstanceOf(AnimalDonationNotFoundError);
  });
});
