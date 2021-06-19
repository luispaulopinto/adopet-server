import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateAnimalDonationUseCase from './CreateAnimalDonationUseCase';

export default class CreateAnimalDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { title, description, animalType, animalBreed, age } = request.body;

    const files = request.files as Express.Multer.File[];

    const createAnimalDonationUseCase = container.resolve(
      CreateAnimalDonationUseCase,
    );

    const animalDonation = await createAnimalDonationUseCase.execute({
      files,
      userId,
      title,
      description,
      animalType,
      animalBreed,
      age,
    });

    return response.status(201).json(animalDonation);
  }
}
