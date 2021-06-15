import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ShowUserProfileUseCase from '@modules/users/useCases/showUserProfile/ShowUserProfileUseCase';

export default class ProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showUserProfileUseCase = container.resolve(ShowUserProfileUseCase);

    const user = await showUserProfileUseCase.execute({
      userId,
    });
    return response.status(200).json(user);
  }
}
