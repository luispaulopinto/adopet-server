import { injectable, inject } from 'tsyringe';

import { classToClass } from 'class-transformer';

import { UserNotFoundError } from '@modules/users/errors';

import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';

import AnimalDonation from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalDonation';

import IAnimalDonationRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalDonationRepository';
import AnimalDonationNotFoundError from '@modules/animalDonation/errors/AnimalDonationNotFoundError';

interface IDonationRequest {
  userId: string;
  donationId: string;
}

@injectable()
class ShowAnimalDonationUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('AnimalDonationRepository')
    private animalDonationRepository: IAnimalDonationRepository,
  ) {}

  public async execute({
    userId,
    donationId,
  }: IDonationRequest): Promise<AnimalDonation> {
    const userExists = await this.userRepository.findById(userId);

    if (!userExists) throw new UserNotFoundError();

    const userAnimal = await this.animalDonationRepository.findById(
      donationId,
      ['images', 'user'],
    );

    if (!userAnimal) throw new AnimalDonationNotFoundError();

    return classToClass(userAnimal);
  }
}

export default ShowAnimalDonationUseCase;
