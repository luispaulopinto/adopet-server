import { Request, Response } from 'express';

import { container } from 'tsyringe';

import DeleteAnimalDonationUseCase from './DeleteAnimalDonationUseCase';

export default class ShowAnimalDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { donationId } = request.params;

    const deleteAnimalDonationUseCase = container.resolve(
      DeleteAnimalDonationUseCase,
    );

    const userAnimals = await deleteAnimalDonationUseCase.execute({
      userId,
      donationId,
    });

    return response.status(204).json(userAnimals);
  }
}
