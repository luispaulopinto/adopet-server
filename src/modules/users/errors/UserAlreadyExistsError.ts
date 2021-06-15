import AppError from '@shared/errors/AppError';

export default class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists.', 409);
  }
}
