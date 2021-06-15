import { Router } from 'express';

import userRouter from '@modules/users/infra/http/routes/users.routes';
import authenticationRouter from '@modules/users/infra/http/routes/authentication.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import refreshTokenRouter from '@modules/users/infra/http/routes/refreshToken.routes';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/authenticate', authenticationRouter);
routes.use('/refresh-token', refreshTokenRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
