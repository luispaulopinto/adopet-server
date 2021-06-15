import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ResetPasswordUseCase from '@modules/users/useCases/resetPassword/ResetPasswordUseCase';

// index, show, create, update, delete

export default class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    const resetPassword = container.resolve(ResetPasswordUseCase);

    await resetPassword.execute({
      token,
      password,
    });

    return response.status(204).json();
  }
}
