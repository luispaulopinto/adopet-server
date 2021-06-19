import AppError from '@shared/errors/AppError';

export default class NoImagesToUploadError extends AppError {
  constructor() {
    super('No images to upload', 400);
  }
}
