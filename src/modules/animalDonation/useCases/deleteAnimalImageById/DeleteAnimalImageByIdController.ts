import { Request, Response } from 'express';

import { container } from 'tsyringe';

import DeleteAnimalImageByIdUseCase from './DeleteAnimalImageByIdUseCase';

export default class DeleteAnimalImageByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { donationId, imageId } = request.params;

    const deleteAnimalImageByIdUseCase = container.resolve(
      DeleteAnimalImageByIdUseCase,
    );

    await deleteAnimalImageByIdUseCase.execute({
      userId,
      donationId,
      imageId,
    });

    return response.status(204).send();
  }
}
