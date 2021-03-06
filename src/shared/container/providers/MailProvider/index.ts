import { container } from 'tsyringe';

import mailConfig from '@config/mail';

import IMailProvider from './contracts/IMailProvider';
import EtherealMailProvider from './implementations/EtherealMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(EtherealMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
