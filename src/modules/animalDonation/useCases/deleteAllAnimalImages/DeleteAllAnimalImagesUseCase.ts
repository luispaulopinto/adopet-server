import { injectable, inject } from 'tsyringe';

import { UserNotFoundError } from '@modules/users/errors';

import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';
import IAnimalImageRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalImageRepository';
import AnimalImageNotFoundError from '@modules/animalDonation/errors/AnimalImageNotFoundError';

interface IUserRequest {
  userId: string;
  donationId: string;
}

@injectable()
class DeleteAllAnimalImagesUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('AnimalImageRepository')
    private animalImageRepository: IAnimalImageRepository,
  ) {}

  public async execute({ userId, donationId }: IUserRequest): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new UserNotFoundError();

    const rowCount = await this.animalImageRepository.delete(
      userId,
      donationId,
    );

    if (rowCount === 0) throw new AnimalImageNotFoundError();
  }
}

export default DeleteAllAnimalImagesUseCase;
