import { container } from 'tsyringe';

import IHashProvider from './contracts/IHashProvider';
import BCryptHashProvider from './implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
