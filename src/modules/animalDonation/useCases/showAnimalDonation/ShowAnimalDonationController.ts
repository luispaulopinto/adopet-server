import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ShowAnimalDonationUseCase from './ShowAnimalDonationUseCase';

export default class ShowAnimalDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { donationId } = request.params;

    const showAnimalDonationUseCase = container.resolve(
      ShowAnimalDonationUseCase,
    );

    const userAnimals = await showAnimalDonationUseCase.execute({
      userId,
      donationId,
    });

    return response.status(200).json(userAnimals);
  }
}
