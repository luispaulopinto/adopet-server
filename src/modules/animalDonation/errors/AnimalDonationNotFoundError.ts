import AppError from '@shared/errors/AppError';

export default class AnimalDonationNotFoundError extends AppError {
  constructor() {
    super('Animal donation not found.', 404);
  }
}
