import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateAnimalImagesUseCase from './CreateAnimalImagesUseCase';

export default class CreateAnimalImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { donationId } = request.params;

    const files = request.files as Express.Multer.File[];

    const createAnimalImagesUseCase = container.resolve(
      CreateAnimalImagesUseCase,
    );

    const images = await createAnimalImagesUseCase.execute({
      files,
      userId,
      animalDonationId: donationId,
    });

    return response.status(201).json(images);
  }
}
