import { Request, Response, NextFunction } from 'express';

import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';

import { isCelebrateError } from 'celebrate';
import multer from 'multer';

export default function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response {
  // CODE TO DELETE TEMP FILES IF OCCURS ANY ERRORS
  try {
    fs.readdir(uploadConfig.tmpFolder, (err, files) => {
      if (err) throw err;
      // eslint-disable-next-line no-restricted-syntax
      for (const file of files) {
        if (file !== 'test_files' && file !== 'uploads') {
          fs.unlink(path.join(`${uploadConfig.tmpFolder}`, file), fileErr => {
            if (fileErr) throw fileErr;
          });
        }
      }
    });
    // eslint-disable-next-line no-empty
  } catch {}

  if (isCelebrateError(error)) {
    const errorBody = error.details.get('body'); // 'details' is a Map()
    const errorCookies = error.details.get('cookies'); // 'details' is a Map()

    const statusCode = errorCookies ? 401 : 400;
    const errorMessage = errorCookies
      ? 'refresh token expired.'
      : errorBody?.details[0].message;

    // console.log('errorCookies', errorCookies?.details[0].message);
    // error.details.forEach(function (value, key) {
    //   console.log(`*************`);
    //   console.log(`${key} = ${value}`);
    // }, error.details);

    return response.status(statusCode).send({
      status: 'Error',
      message: errorMessage,
    });
  }

  if (error instanceof multer.MulterError) {
    return response.status(400).json({
      status: 'Error',
      message: error.message,
    });
  }

  if (error instanceof AppError)
    return response.status(error.statusCode).json({
      status: 'Error',
      message: error.message,
    });

  return response.status(500).json({
    status: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev'
        ? `message: ${error.message}, stacktrace: ${error.stack}` // 'Interal server error.',
        : 'Please try again later or feel free to contact us if the problem persists.',
  });
}
