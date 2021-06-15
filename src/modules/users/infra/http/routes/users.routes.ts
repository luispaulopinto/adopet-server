import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import CreateUserController from '../../../useCases/createUser/CreateUserController';
import UpdateUserAvatarController from '../../../useCases/updateUserAvatar/UpdateUserAvatarController';
import createUserSchema from '../schemas/user.schema';

const userRouter = Router();
const userController = new CreateUserController();
const userAvatarController = new UpdateUserAvatarController();

const upload = multer({
  storage: uploadConfig.storage,
  fileFilter: uploadConfig.imageFileFilter,
});

userRouter.post('/', createUserSchema, userController.handle);

userRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.handle,
);

export default userRouter;
