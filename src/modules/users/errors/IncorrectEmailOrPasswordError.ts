import AppError from '@shared/errors/AppError';

export default class IncorrectEmailOrPasswordError extends AppError {
  constructor() {
    super('Incorrect email or password.', 401);
  }
}
