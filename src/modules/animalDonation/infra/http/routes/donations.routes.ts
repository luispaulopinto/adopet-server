import { Router } from 'express';

import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import CreateAnimalDonationController from '@modules/animalDonation/useCases/createAnimalDonation/CreateAnimalDonationController';
import CreateAnimalImagesController from '@modules/animalDonation/useCases/createAnimalImages/CreateAnimalImagesController';
import UpdateAnimalDonationController from '@modules/animalDonation/useCases/updateAnimalDonation/UpdateAnimalDonationController';
import ShowAnimalDonationController from '@modules/animalDonation/useCases/showAnimalDonation/ShowAnimalDonationController';
import DeleteAnimalDonationController from '@modules/animalDonation/useCases/deleteAnimalDonation/DeleteAnimalDonationController';
import DeleteAnimalImageByIdController from '@modules/animalDonation/useCases/deleteAnimalImageById/DeleteAnimalImageByIdController';
import DeleteAllAnimalImagesController from '@modules/animalDonation/useCases/deleteAllAnimalImages/DeleteAllAnimalImagesController';

import {
  createAnimalDonationSchema,
  updateAnimalDonationSchema,
} from '../schemas/donation.schema';

const donationRouter = Router();
const createAnimalDonationController = new CreateAnimalDonationController();
const createAnimalImagesController = new CreateAnimalImagesController();
const updateAnimalDonationController = new UpdateAnimalDonationController();
const showAnimalDonationController = new ShowAnimalDonationController();
const deleteAnimalDonationController = new DeleteAnimalDonationController();
const deleteAnimalImageByIdController = new DeleteAnimalImageByIdController();
const deleteAllAnimalImagesController = new DeleteAllAnimalImagesController();

const upload = multer({
  storage: uploadConfig.storage,
  fileFilter: uploadConfig.imageFileFilter,
});

donationRouter.use(ensureAuthenticated);

donationRouter.get('/:donationId', showAnimalDonationController.handle);

donationRouter.post(
  '/',
  upload.array('images'),
  createAnimalDonationSchema,
  createAnimalDonationController.handle,
);

donationRouter.put(
  '/:donationId',
  upload.array('images'),
  updateAnimalDonationSchema,
  updateAnimalDonationController.handle,
);

donationRouter.patch(
  '/:donationId',
  upload.array('images'),
  createAnimalImagesController.handle,
);

donationRouter.delete('/:donationId', deleteAnimalDonationController.handle);

donationRouter.delete(
  '/:donationId/images',
  deleteAllAnimalImagesController.handle,
);

donationRouter.delete(
  '/:donationId/images/:imageId',
  deleteAnimalImageByIdController.handle,
);

export default donationRouter;
