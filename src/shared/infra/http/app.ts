import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';

import '@shared/container';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';

import createConnection from '@shared/infra/typeorm';

import uploadConfig from '@config/upload';

import errorHandler from '@shared/infra/http/middlewares/errorHandler';

import routes from './routes';

import swaggerDocument from './swagger/swagger';
import swaggerOptions from './swagger/options';

createConnection();
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errorHandler);

export default app;
