import { container } from 'tsyringe';

import '@shared/container/providers';

import IUserRepository from '@modules/users/infra/databases/contracts/IUserRepository';
import UserRepository from '@modules/users/infra/databases/typeorm/repositories/UserRepository';

import IUserTokenRepository from '@modules/users/infra/databases/contracts/IUserTokenRepository';
import UserTokenRepository from '@modules/users/infra/databases/typeorm/repositories/UserTokenRepository';
import IAnimalDonationRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalDonationRepository';
import AnimalDonationRepository from '@modules/animalDonation/infra/databases/typeorm/repositories/AnimalDonationRepository';
import AnimalImageRepository from '@modules/animalDonation/infra/databases/typeorm/repositories/AnimalImageRepository';
import IAnimalImageRepository from '@modules/animalDonation/infra/databases/contracts/IAnimalImageRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);

container.registerSingleton<IAnimalDonationRepository>(
  'AnimalDonationRepository',
  AnimalDonationRepository,
);

container.registerSingleton<IAnimalImageRepository>(
  'AnimalImageRepository',
  AnimalImageRepository,
);
