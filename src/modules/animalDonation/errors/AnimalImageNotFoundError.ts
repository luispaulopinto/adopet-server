import AppError from '@shared/errors/AppError';

export default class AnimalImageNotFoundError extends AppError {
  constructor() {
    super('Animal image not found.', 404);
  }
}
