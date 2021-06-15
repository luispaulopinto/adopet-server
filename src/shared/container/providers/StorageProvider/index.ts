import { container } from 'tsyringe';

// import uploadConfig from '@config/upload';

import IStorageProvider from './contracts/IStorageProvider';
import DiskStorageProvider from './implementations/DiskStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: DiskStorageProvider,
};

// TODO: check provider set from config file
container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers.disk,
);
