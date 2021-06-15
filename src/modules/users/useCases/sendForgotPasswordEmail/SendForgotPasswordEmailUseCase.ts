import { injectable, inject } from 'tsyringe';
import path from 'path';

import IMailProvider from '@shared/container/providers/MailProvider/contracts/IMailProvider';

import { InvalidTokenError, UserNotFoundError } from '@modules/users/errors';

interface IForgotPasswordRequest {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

@injectable()
class SendForgotPasswordEmailUseCase {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ user, token }: IForgotPasswordRequest): Promise<void> {
    if (!user || !user.id || !user.name || !user.email)
      throw new UserNotFoundError();

    if (!token) throw new InvalidTokenError();

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'ForgotPassword.hbs',
    );

    await this.mailProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[AdoPet] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailUseCase;
