import { injectable, inject } from 'tsyringe';

import { classToClass } from 'class-transformer';

import { UserNotFoundError } from '@modules/users/errors';

import IAnimalDonationRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalDonationRepository';
import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/contracts/IStorageProvider';

import AnimalDonation from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalDonation';
import AnimalImage from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalImage';

interface IFile {
  filename: string;
}

interface IUserRequest {
  files: IFile[];
  userId: string;
  title: string;
  description: string;
  animalType: string;
  animalBreed: string;
  age: number;
}

@injectable()
class CreateAnimalDonationUseCase {
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
    title,
    description,
    animalType,
    animalBreed,
    age,
  }: IUserRequest): Promise<AnimalDonation> {
    const userExists = await this.userRepository.findById(userId);

    if (!userExists) throw new UserNotFoundError();

    const animalDonation = {
      ...new AnimalDonation(),
      userId,
      title,
      description,
      animalType,
      animalBreed,
      age,
    };

    animalDonation.images = [];
    if (files && files.length > 0) {
      await Promise.all(
        (files as IFile[]).map(async file => {
          const fileName = await this.storageProvider.saveFile(file.filename);

          const animalImage = new AnimalImage();
          animalImage.fileName = fileName;
          animalDonation.images.push(animalImage);
        }),
      );
    }

    const donationCreated = await this.animalDonationRepository.create(
      animalDonation,
    );

    return classToClass(donationCreated);
  }
}

export default CreateAnimalDonationUseCase;
