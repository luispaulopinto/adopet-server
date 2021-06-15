import { Request, Response } from 'express';

import { container } from 'tsyringe';

// import parser from 'ua-parser-js';

import AuthenticateUserUseCase from '@modules/users/useCases/authenticateUser/AuthenticateUserUseCase';
import CreateAccessTokenUseCase from '../createToken/CreateAccessTokenUseCase';
import CreateRefreshTokenUseCase from '../createToken/CreateRefreshTokenUseCase';

// index, show, create, update, delete

export default class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    // console.log(parser(request.headers['user-agent']));

    const authenticateUser = container.resolve(AuthenticateUserUseCase);
    const createAccessToken = container.resolve(CreateAccessTokenUseCase);
    const createRefreshToken = container.resolve(CreateRefreshTokenUseCase);

    const user = await authenticateUser.execute({
      email,
      password,
    });

    const accessToken = await createAccessToken.execute({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    const refreshToken = await createRefreshToken.execute({ userId: user.id });

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
      user,
      token: accessToken.token,
    });
  }
}
