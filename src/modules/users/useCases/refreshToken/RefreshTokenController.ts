import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateAccessTokenUseCase from '../createToken/CreateAccessTokenUseCase';
import CreateRefreshTokenUseCase from '../createToken/CreateRefreshTokenUseCase';
import ShowUserProfileUseCase from '../showUserProfile/ShowUserProfileUseCase';

// index, show, create, update, delete

export default class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { rtid, uid } = request.cookies;

    const showUserProfileUseCase = container.resolve(ShowUserProfileUseCase);
    const createAccessToken = container.resolve(CreateAccessTokenUseCase);
    const createRefreshToken = container.resolve(CreateRefreshTokenUseCase);

    const refreshToken = await createRefreshToken.execute({
      userId: uid,
      token: rtid,
    });

    const user = await showUserProfileUseCase.execute({
      userId: uid,
    });

    const accessToken = await createAccessToken.execute({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    response.cookie('rtid', refreshToken.token, {
      // maxAge: 60 * 1000, // convert from minute to milliseconds
      expires: refreshToken.expiresIn,
      httpOnly: true,
      secure: false,
    });

    response.cookie('uid', user.id, {
      // maxAge: 60 * 1000, // convert from minute to milliseconds
      expires: refreshToken.expiresIn,
      httpOnly: true,
      secure: false,
    });

    return response.status(200).json({
      token: accessToken.token,
    });
  }
}
