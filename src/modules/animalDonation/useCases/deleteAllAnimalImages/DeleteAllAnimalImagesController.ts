import { Request, Response } from 'express';

import { container } from 'tsyringe';

import DeleteAllAnimalImagesUseCase from './DeleteAllAnimalImagesUseCase';

export default class DeleteAllAnimalImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { donationId } = request.params;

    const deleteAllAnimalImagesUseCase = container.resolve(
      DeleteAllAnimalImagesUseCase,
    );

    await deleteAllAnimalImagesUseCase.execute({
      userId,
      donationId,
    });

    return response.status(204).send();
  }
}
