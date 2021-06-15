import { Router } from 'express';

import SendForgotPasswordController from '../../../useCases/sendForgotPasswordEmail/SendForgotPasswordController';
import ResetPasswordController from '../../../useCases/resetPassword/ResetPasswordController';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/password.schemas';

const passwordRouter = Router();
const sendForgotPasswordController = new SendForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/forgot',
  forgotPasswordSchema,
  sendForgotPasswordController.handle,
);

passwordRouter.post(
  '/reset',
  resetPasswordSchema,
  resetPasswordController.handle,
);

export default passwordRouter;
