import { celebrate, Segments, Joi } from 'celebrate';

const createAnimalDonationSchema = celebrate({
  [Segments.BODY]: {
    title: Joi.string().required(),
    description: Joi.string().required(),
    animalType: Joi.string().required(),
    animalBreed: Joi.string().required(),
    age: Joi.number().required(),
  },
});

const updateAnimalDonationSchema = celebrate({
  [Segments.BODY]: {
    title: Joi.string().required(),
    description: Joi.string().required(),
    animalType: Joi.string().required(),
    animalBreed: Joi.string().required(),
    age: Joi.number().required(),
  },
});

export { createAnimalDonationSchema, updateAnimalDonationSchema };
