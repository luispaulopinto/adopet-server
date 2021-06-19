import AnimalDonationNotFoundError from '@modules/animalDonation/errors/AnimalDonationNotFoundError';
import NoImagesToUploadError from '@modules/animalDonation/errors/NoImagesToUploadError';
import { UserWithoutCredentialsError } from '@modules/users/errors';
import InMemoryUserRepository from '@modules/users/infra/databases/inMemory/InMemoryUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import InMemoryAnimalDonationRepository from '../../infra/databases/inMemory/InMemoryAnimalDonationRepository';
import InMemoryAnimalImageRepository from '../../infra/databases/inMemory/InMemoryAnimalImageRepository';
import CreateAnimalImagesUseCase from './CreateAnimalImagesUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAnimalDonationRepository: InMemoryAnimalDonationRepository;
let inMemoryAnimalImageRepository: InMemoryAnimalImageRepository;
let fakeStorageProvider: FakeStorageProvider;
let createAnimalImagesUseCase: CreateAnimalImagesUseCase;

describe('Create Animal Images UseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryAnimalDonationRepository = new InMemoryAnimalDonationRepository();
    inMemoryAnimalImageRepository = new InMemoryAnimalImageRepository();
    fakeStorageProvider = new FakeStorageProvider();

    createAnimalImagesUseCase = new CreateAnimalImagesUseCase(
      inMemoryAnimalDonationRepository,
      inMemoryAnimalImageRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create new animal images for donation', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const donation = await inMemoryAnimalDonationRepository.create({
      userId: user.id,
      title: 'Titulo Doação',
      description: 'Descrição Doação',
      animalType: 'cachorro',
      animalBreed: 'vira-lata',
      age: 1,
    });

    const animalImageCreated = jest.spyOn(
      inMemoryAnimalImageRepository,
      'create',
    );

    await createAnimalImagesUseCase.execute({
      files: [{ filename: 'image01.jpg' }, { filename: 'image02.jpg' }],
      userId: user.id,
      animalDonationId: donation.id,
    });

    expect(animalImageCreated).toHaveBeenCalledTimes(1);
  });

  it('should NOT be able to create new animal image with empty files to upload', async () => {
    await expect(
      createAnimalImagesUseCase.execute({
        files: [],
        userId: 'UserId',
        animalDonationId: 'animalDonationId',
      }),
    ).rejects.toBeInstanceOf(NoImagesToUploadError);
  });

  it('should NOT be able to create new animal image for a non-existing donation', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    await expect(
      createAnimalImagesUseCase.execute({
        files: [{ filename: 'image01.jpg' }],
        userId: user.id,
        animalDonationId: 'animalDonationId',
      }),
    ).rejects.toBeInstanceOf(AnimalDonationNotFoundError);
  });

  it('should NOT be able to create new animal image for a donation NOT related to the user authenticate', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Teste',
      email: 'teste@teste.com.br',
      password: '123456',
      isOng: false,
    });

    const donation = await inMemoryAnimalDonationRepository.create({
      userId: user.id,
      title: 'Titulo Doação',
      description: 'Descrição Doação',
      animalType: 'cachorro',
      animalBreed: 'vira-lata',
      age: 1,
    });

    await expect(
      createAnimalImagesUseCase.execute({
        files: [{ filename: 'image01.jpg' }],
        userId: 'UserId',
        animalDonationId: donation.id,
      }),
    ).rejects.toBeInstanceOf(UserWithoutCredentialsError);
  });
});
