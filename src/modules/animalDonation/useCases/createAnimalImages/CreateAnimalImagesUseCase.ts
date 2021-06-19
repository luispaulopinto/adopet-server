import { injectable, inject } from 'tsyringe';

import { classToClass } from 'class-transformer';

import { UserWithoutCredentialsError } from '@modules/users/errors';

import IAnimalDonationRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalDonationRepository';
import IAnimalImageRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalImageRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/contracts/IStorageProvider';

import ICreateAnimalImageDTO from '@modules/animalDonation/dtos/ICreateAnimalImageDTO';
import AnimalDonationNotFoundError from '@modules/animalDonation/errors/AnimalDonationNotFoundError';
import AnimalImage from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalImage';
import NoImagesToUploadError from '@modules/animalDonation/errors/NoImagesToUploadError';

interface IFile {
  filename: string;
}

interface IUserRequest {
  files: IFile[];
  userId: string;
  animalDonationId: string;
}

@injectable()
class CreateAnimalImagesUseCase {
  constructor(
    @inject('AnimalDonationRepository')
    private animalDonationRepository: IAnimalDonationRepository,

    @inject('AnimalImageRepository')
    private animalImageRepository: IAnimalImageRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    files,
    userId,
    animalDonationId,
  }: IUserRequest): Promise<AnimalImage[]> {
    if (!files || files.length === 0) throw new NoImagesToUploadError();

    const donation = await this.animalDonationRepository.findById(
      animalDonationId,
    );

    if (!donation) throw new AnimalDonationNotFoundError();

    if (donation.userId !== userId) throw new UserWithoutCredentialsError();

    const animalImages: ICreateAnimalImageDTO[] = [];

    await Promise.all(
      (files as IFile[]).map(async file => {
        const fileName = await this.storageProvider.saveFile(file.filename);

        animalImages.push({ animalDonationId, fileName });
      }),
    );

    const images = await this.animalImageRepository.create(animalImages);

    return classToClass(images);
  }
}

export default CreateAnimalImagesUseCase;
