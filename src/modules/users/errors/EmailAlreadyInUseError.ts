import AppError from '@shared/errors/AppError';

export default class EmailAlreadyInUseError extends AppError {
  constructor() {
    super('Email already in use.', 409);
  }
}
