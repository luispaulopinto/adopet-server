import { Router } from 'express';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import UpdateUserProfileController from '../../../useCases/updateUserProfile/UpdateUserProfileController';
import ShowUserProfileController from '../../../useCases/showUserProfile/ShowUserProfileController';
import updateUserProfileSchema from '../schemas/profile.schema';

const profileRouter = Router();
const updateUserProfileController = new UpdateUserProfileController();
const showUserProfileController = new ShowUserProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', showUserProfileController.handle);
profileRouter.put(
  '/',
  updateUserProfileSchema,
  updateUserProfileController.handle,
);

export default profileRouter;
