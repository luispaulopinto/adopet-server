import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';
import { container } from 'tsyringe';
import JwtProvider from '@shared/container/providers/JwtProvider/implementations/JwtProvider';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError('JWT token is missing.', 401);

  // Authorization: Bearer *token*
  const [, token] = authHeader.split(' ');

  const jwtProvider = container.resolve(JwtProvider);

  const decoded = jwtProvider.verify(token);

  const { sub } = decoded as ITokenPayload;
  request.user = { id: sub };
  return next();
}
