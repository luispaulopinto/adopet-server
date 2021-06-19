import AnimalImageNotFoundError from '@modules/animalDonation/errors/AnimalImageNotFoundError';
import AnimalImage from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalImage';
import { UserNotFoundError } from '@modules/users/errors';
import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';
import User from '@modules/users/infra/databases/typeorm/entities/User';
import InMemoryAnimalImage from '../../infra/databases/inMemory/InMemoryAnimalImageRepository';
import DeleteAllAnimalImagesUseCase from './DeleteAllAnimalImagesUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalImage: InMemoryAnimalImage;
let deleteAllAnimalImagesUseCase: DeleteAllAnimalImagesUseCase;

let user: User;
let animalImage: AnimalImage[];

describe('Delete All Animal Image Use Case', () => {
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalImage = new InMemoryAnimalImage();
    deleteAllAnimalImagesUseCase = new DeleteAllAnimalImagesUseCase(
      inMemoryUserRepository,
      inMemoryAnimalImage,
    );

    user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    animalImage = await inMemoryAnimalImage.create([
      {
        animalDonationId: '00000000-0000-0000-0000-000000000000',
        fileName: 'file.jpg',
      },
    ]);
  });

  it('should be able to delete all animal image from donation', async () => {
    const deleteFn = jest.spyOn(inMemoryAnimalImage, 'delete');

    await deleteAllAnimalImagesUseCase.execute({
      userId: user.id,
      donationId: animalImage[0].animalDonationId,
    });

    expect(deleteFn).toHaveBeenCalledTimes(1);
  });

  it('should NOT be able to delete all animal images from a non-existing donation', async () => {
    await expect(
      deleteAllAnimalImagesUseCase.execute({
        userId: user.id,
        donationId: 'animalDonationId',
      }),
    ).rejects.toBeInstanceOf(AnimalImageNotFoundError);
  });

  it('should NOT be able to delete an animal image with a non-existing user', async () => {
    await expect(
      deleteAllAnimalImagesUseCase.execute({
        userId: 'UserId',
        donationId: animalImage[0].animalDonationId,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
