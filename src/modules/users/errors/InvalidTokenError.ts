import AppError from '@shared/errors/AppError';

export default class InvalidTokenError extends AppError {
  constructor() {
    super('Invalid Token.', 401);
  }
}
