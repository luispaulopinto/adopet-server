import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListAnimalDonationsUseCase from './ListAnimalDonationsUseCase';

export default class ListAnimalDonationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { limit, page } = request.query;

    const listAnimalDonationsUseCase = container.resolve(
      ListAnimalDonationsUseCase,
    );
    // console.log(request.url);

    const userAnimals = await listAnimalDonationsUseCase.execute({
      limit: Number(limit),
      page: Number(page),
      baseUrl: request.baseUrl,
    });

    return response.status(200).json(userAnimals);
  }
}
