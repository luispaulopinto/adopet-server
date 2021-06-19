import { Request, Response } from 'express';

import { container } from 'tsyringe';

import UpdateAnimalDonationUseCase from './UpdateAnimalDonationUseCase';

export default class UpdateAnimalDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { donationId } = request.params;

    const files = request.files as Express.Multer.File[];

    const { title, description, animalType, animalBreed, age } = request.body;

    const updateAnimalDonationUseCase = container.resolve(
      UpdateAnimalDonationUseCase,
    );

    const animalDonation = await updateAnimalDonationUseCase.execute({
      files,
      userId,
      animalId: donationId,
      title,
      description,
      animalType,
      animalBreed,
      age,
    });

    return response.status(200).json(animalDonation);
  }
}
