import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import ListAnimalDonationsController from '@modules/animalDonation/useCases/listAnimalDonations/ListAnimalDonationsController';

const feedsRouter = Router();
const listAnimalDonationsController = new ListAnimalDonationsController();

feedsRouter.use(ensureAuthenticated);

feedsRouter.get('/', listAnimalDonationsController.handle);

export default feedsRouter;
