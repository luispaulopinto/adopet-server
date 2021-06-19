import AnimalImageNotFoundError from '@modules/animalDonation/errors/AnimalImageNotFoundError';
import { UserNotFoundError } from '@modules/users/errors';

import User from '@modules/users/infra/databases/typeorm/entities/User';
import AnimalImage from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalImage';

import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';
import InMemoryAnimalImage from '../../infra/databases/inMemory/InMemoryAnimalImageRepository';

import DeleteAnimalImageByIdUseCase from './DeleteAnimalImageByIdUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalImage: InMemoryAnimalImage;
let deleteAnimalImageByIdUseCase: DeleteAnimalImageByIdUseCase;

let user: User;
let animalImage: AnimalImage[];

describe('Delete Animal Image By Id Use Case', () => {
  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalImage = new InMemoryAnimalImage();
    deleteAnimalImageByIdUseCase = new DeleteAnimalImageByIdUseCase(
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

  it('should be able to delete an animal image', async () => {
    const deleteFn = jest.spyOn(inMemoryAnimalImage, 'deleteById');

    await deleteAnimalImageByIdUseCase.execute({
      userId: user.id,
      donationId: animalImage[0].animalDonationId,
      imageId: animalImage[0].id,
    });

    expect(deleteFn).toHaveBeenCalledTimes(1);
  });

  it('should NOT be able to delete an non-existing animal image', async () => {
    await expect(
      deleteAnimalImageByIdUseCase.execute({
        userId: user.id,
        donationId: animalImage[0].animalDonationId,
        imageId: 'AnimalImageId',
      }),
    ).rejects.toBeInstanceOf(AnimalImageNotFoundError);
  });

  it('should NOT be able to delete an animal image with a non-existing user', async () => {
    await expect(
      deleteAnimalImageByIdUseCase.execute({
        userId: 'UserId',
        donationId: animalImage[0].animalDonationId,
        imageId: animalImage[0].id,
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });
});
