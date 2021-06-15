import { Request, Response } from 'express';

import { container } from 'tsyringe';

import UpdateUserAvatarUseCase from '@modules/users/useCases/updateUserAvatar/UpdateUserAvatarUseCase';

export default class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarUseCase);

    const user = await updateUserAvatar.execute({
      userId: request.user.id,
      avatarFilename: request.file.filename,
    });

    return response.status(200).json(user);
  }
}
