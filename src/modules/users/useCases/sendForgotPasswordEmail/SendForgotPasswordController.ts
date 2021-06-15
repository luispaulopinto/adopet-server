import { Request, Response } from 'express';

import { container } from 'tsyringe';

import SendForgotPasswordEmailUseCase from '@modules/users/useCases/sendForgotPasswordEmail/SendForgotPasswordEmailUseCase';
import CreateResetTokenUseCase from '../createToken/CreateResetTokenUseCase';

// index, show, create, update, delete

export default class SendForgotPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const createResetTokenUseCase = container.resolve(CreateResetTokenUseCase);

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordEmailUseCase,
    );

    const userToken = await createResetTokenUseCase.execute(email);

    await sendForgotPasswordEmail.execute({
      user: userToken.user,
      token: userToken.token,
    });

    return response.status(204).json();
  }
}
