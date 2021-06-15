import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

import { sign, verify } from 'jsonwebtoken';

import IJwtProvider, {
  IJwtCreateResponse,
  ISignOptions,
} from '../contracts/IJwtProvider';

// Site para gerar secret MD5 => http://www.md5.cz/
// Site para verificat JWT => jwt.io

class JwtProvider implements IJwtProvider {
  create(payload: string | object, options?: ISignOptions): IJwtCreateResponse {
    // console.log('secret node env', authConfig);
    const { secret, expiresInToken: expiresIn } = authConfig.token;
    const token = sign(payload, secret, {
      ...options,
      expiresIn,
    });

    return { token, expiresIn };
  }

  verify(token: string): string | object {
    const { secret } = authConfig.token;
    try {
      return verify(token, secret);
    } catch {
      throw new AppError('Invalid JWT token.', 401);
    }
  }
}

export default JwtProvider;
