import { Router } from 'express';

import userRouter from '@modules/users/infra/http/routes/users.routes';
import authenticationRouter from '@modules/users/infra/http/routes/authentication.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import refreshTokenRouter from '@modules/users/infra/http/routes/refreshToken.routes';
import donationsRouter from '@modules/animalDonation/infra/http/routes/donations.routes';
import userDonationsRouter from '@modules/animalDonation/infra/http/routes/userDonations.routes';
import feedsRouter from '@modules/animalDonation/infra/http/routes/feeds.routes';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/authenticate', authenticationRouter);
routes.use('/refresh-token', refreshTokenRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/donations', donationsRouter);
routes.use('/users/:userId/donations', userDonationsRouter);
routes.use('/feeds', feedsRouter);

export default routes;
