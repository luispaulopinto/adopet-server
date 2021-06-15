import { container } from 'tsyringe';

import IJwtProvider from './contracts/IJwtProvider';
import JwtProvider from './implementations/JwtProvider';

container.registerSingleton<IJwtProvider>('JwtProvider', JwtProvider);
