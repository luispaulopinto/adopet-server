import ISendmailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendEmail(data: ISendmailDTO): Promise<void>;
}
