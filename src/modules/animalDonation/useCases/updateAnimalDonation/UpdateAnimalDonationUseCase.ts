import { injectable, inject } from 'tsyringe';

import { classToClass } from 'class-transformer';

import { UserNotFoundError } from '@modules/users/errors';

import AnimalDonationNotFoundError from '@modules/animalDonation/errors/AnimalDonationNotFoundError';

import AnimalDonation from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalDonation';
import AnimalImage from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalImage';

import IAnimalDonationRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalDonationRepository';
import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/contracts/IStorageProvider';

interface IFile {
  filename: string;
}

interface IUserRequest {
  files: IFile[];
  userId: string;
  animalId: string;
  title: string;
  description: string;
  animalType: string;
  animalBreed: string;
  age: number;
}

@injectable()
class UpdateAnimalDonationUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('AnimalDonationRepository')
    private animalDonationRepository: IAnimalDonationRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    files,
    userId,
    animalId,
    title,
    description,
    animalType,
    animalBreed,
    age,
  }: IUserRequest): Promise<AnimalDonation> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundError();

    const animal = await this.animalDonationRepository.findById(animalId);

    if (!animal || animal.userId !== user.id)
      throw new AnimalDonationNotFoundError();

    const updateAnimal = {
      ...animal,
      title,
      description,
      animalType,
      animalBreed,
      age,
    };

    if (files && files.length > 0) {
      await Promise.all(
        (files as IFile[]).map(async file => {
          const fileName = await this.storageProvider.saveFile(file.filename);

          const animalImage = new AnimalImage();
          animalImage.fileName = fileName;
          updateAnimal.images.push(animalImage);
        }),
      );
    }

    const animalDonation = await this.animalDonationRepository.update(
      updateAnimal,
    );

    return classToClass(animalDonation);
  }
}

export default UpdateAnimalDonationUseCase;
