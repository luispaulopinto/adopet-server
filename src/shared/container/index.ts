import { container } from 'tsyringe';

import '@shared/container/providers';

import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';
import UserRepository from '@modules/users/infra/databases/typeorm/repositories/UserRepository';

import IUserTokenRepository from '@modules/users/infra/databases/contracts/IUserTokenRepository';
import UserTokenRepository from '@modules/users/infra/databases/typeorm/repositories/UserTokenRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);
