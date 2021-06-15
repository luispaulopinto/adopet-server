import AppError from '@shared/errors/AppError';

export default class UserWithoutCredentialsError extends AppError {
  constructor() {
    super('User without credentials.', 401);
  }
}
