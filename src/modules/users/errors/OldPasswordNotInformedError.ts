import AppError from '@shared/errors/AppError';

export default class OldPasswordNotInformedError extends AppError {
  constructor() {
    super('Old Password not informed.');
  }
}
