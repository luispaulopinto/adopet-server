import { Router } from 'express';

import RefreshTokenController from '@modules/users/useCases/refreshToken/RefreshTokenController';
import refreshTokenSchema from '../schemas/refreshToken.schema';

const refreshTokenRouter = Router();

const refreshTokenController = new RefreshTokenController();

refreshTokenRouter.post('/', refreshTokenSchema, refreshTokenController.handle);

export default refreshTokenRouter;
