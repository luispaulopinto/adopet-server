import { injectable, inject } from 'tsyringe';

import { UserNotFoundError } from '@modules/users/errors';

import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';

import IAnimalDonationRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalDonationRepository';

import AnimalDonationNotFoundError from '@modules/animalDonation/errors/AnimalDonationNotFoundError';

interface IDonationRequest {
  userId: string;
  donationId: string;
}

@injectable()
class DeleteAnimalDonationUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('AnimalDonationRepository')
    private animalDonationRepository: IAnimalDonationRepository,
  ) {}

  public async execute({
    userId,
    donationId,
  }: IDonationRequest): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundError();

    const animal = await this.animalDonationRepository.findById(donationId);

    if (!animal || animal.userId !== user.id)
      throw new AnimalDonationNotFoundError();

    await this.animalDonationRepository.delete(animal.id);
  }
}

export default DeleteAnimalDonationUseCase;
