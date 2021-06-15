import { injectable, inject } from 'tsyringe';

import nodemailer, { Transporter } from 'nodemailer';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/contracts/IMailTemplateProvider';

import IMailProvider from '../contracts/IMailProvider';
import ISendMailProvider from '../dtos/ISendMailDTO';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendEmail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailProvider): Promise<void> {
    const message = await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe AdoPet',
        address: from?.email || 'equipe@AdoPet.com.br',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default EtherealMailProvider;
