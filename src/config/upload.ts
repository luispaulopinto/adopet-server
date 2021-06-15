import multer, { FileFilterCallback, StorageEngine } from 'multer';
import crypto from 'crypto';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk';

  tmpFolder: string;
  uploadsFolder: string;

  storage: StorageEngine;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageFileFilter: any;
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(_request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const filename = `${fileHash}-${file.originalname}`;
      return callback(null, filename);
    },
  }),
  imageFileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      return callback(null, true);
    }
    callback(null, false);
    const multerError = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
    multerError.message = 'Only .png, .jpg and .jpeg format allowed.';
    return callback(multerError);
  },
} as IUploadConfig;
