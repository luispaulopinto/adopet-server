import AppError from '@shared/errors/AppError';

export default class InvalidPasswordError extends AppError {
  constructor() {
    super('Invalid password.');
  }
}
