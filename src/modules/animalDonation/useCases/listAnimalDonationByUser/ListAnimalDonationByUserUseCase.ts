import { injectable, inject } from 'tsyringe';

import { classToClass } from 'class-transformer';

import { UserNotFoundError } from '@modules/users/errors';

import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';

import AnimalDonation from '@modules/animalDonation/infra/databases/typeorm/entities/AnimalDonation';

import IAnimalDonationRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalDonationRepository';

interface IUserIdRequest {
  userId: string;
}

@injectable()
class ListAnimalDonationByUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('AnimalDonationRepository')
    private animalDonationRepository: IAnimalDonationRepository,
  ) {}

  public async execute({ userId }: IUserIdRequest): Promise<AnimalDonation[]> {
    const userExists = await this.userRepository.findById(userId);

    if (!userExists) throw new UserNotFoundError();

    const userAnimals = await this.animalDonationRepository.findByUserId(
      userId,
    );

    return classToClass(userAnimals);
  }
}

export default ListAnimalDonationByUserUseCase;
