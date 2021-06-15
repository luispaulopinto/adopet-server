import AppError from '@shared/errors/AppError';

export default class UserNotFoundError extends AppError {
  constructor() {
    super('User not found.', 404);
  }
}
