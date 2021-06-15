import { Request, Response } from 'express';

import { container } from 'tsyringe';

import UpdateUserProfileUseCase from '@modules/users/useCases/updateUserProfile/UpdateUserProfileUseCase';

export default class UpdateUserProfileController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, oldPassword, password, uf, city } = request.body;

    const updateProfileUseCase = container.resolve(UpdateUserProfileUseCase);

    const user = await updateProfileUseCase.execute({
      userId,
      name,
      email,
      oldPassword,
      password,
      uf,
      city,
    });

    return response.status(200).json(user);
  }
}
