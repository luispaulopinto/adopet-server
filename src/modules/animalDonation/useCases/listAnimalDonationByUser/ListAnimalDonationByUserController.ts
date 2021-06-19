import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListAnimalDonationByUserUseCase from './ListAnimalDonationByUserUseCase';

export default class ListAnimalDonationByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const listAnimalDonationByUserUseCase = container.resolve(
      ListAnimalDonationByUserUseCase,
    );

    const userAnimals = await listAnimalDonationByUserUseCase.execute({
      userId,
    });

    return response.status(200).json(userAnimals);
  }
}
