import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import ListAnimalDonationByUserController from '@modules/animalDonation/useCases/listAnimalDonationByUser/ListAnimalDonationByUserController';

const userDonationsRouter = Router();

const listAnimalDonationByUserController = new ListAnimalDonationByUserController();

userDonationsRouter.use(ensureAuthenticated);

userDonationsRouter.get('/', listAnimalDonationByUserController.handle);

export default userDonationsRouter;
