import { Router } from 'express';

import AuthenticateUserController from '../../../useCases/authenticateUser/AuthenticateUserController';
import authenticationSchema from '../schemas/authentication.schema';

const authenticationRouter = Router();
const authenticateUserController = new AuthenticateUserController();

authenticationRouter.post(
  '/',
  authenticationSchema,
  authenticateUserController.handle,
);

export default authenticationRouter;
