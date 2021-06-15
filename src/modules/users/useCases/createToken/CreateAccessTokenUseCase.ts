import { injectable, inject } from 'tsyringe';

import IJwtProvider from '@shared/container/providers/JwtProvider/contracts/IJwtProvider';
import { UserNotFoundError } from '@modules/users/errors';

interface IAcccessTokenRequest {
  userId: string;
  name: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  expiresIn: string;
}

@injectable()
class CreateAccessTokenUseCase {
  constructor(
    @inject('JwtProvider')
    private jwtProvider: IJwtProvider,
  ) {}

  public async execute({
    userId,
    name,
    email,
  }: IAcccessTokenRequest): Promise<ITokenResponse> {
    if (!userId || !email || !name) throw new UserNotFoundError();

    const jwtPayload = {
      data: {
        name,
        email,
      },
    };

    const jwtOptions = {
      subject: userId,
    };

    return this.jwtProvider.create(jwtPayload, jwtOptions);
  }
}

export default CreateAccessTokenUseCase;
