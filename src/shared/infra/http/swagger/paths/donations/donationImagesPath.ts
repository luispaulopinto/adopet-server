import {
  statusCode400,
  statusCode401,
  statusCode404,
  statusCode500,
} from '../../responses';

const donationsPath = {
  deleteAll: {
    tags: ['Donations'],
    summary: 'Delete all images from an animal donation',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'donationId',
        in: 'path',
        description: 'Donnation id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      '200': {
        description: 'Images donation deleted successfully.',
      },
      '400': statusCode400,
      '401': statusCode401,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
  deleteById: {
    tags: ['Donations'],
    summary: 'Delete an image from an animal donation',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'donationId',
        in: 'path',
        description: 'Donnation id',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        name: 'ImageId',
        in: 'path',
        description: 'Image id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      '200': {
        description: 'Image donation deleted successfully.',
      },
      '400': statusCode400,
      '401': statusCode401,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
};

export default donationsPath;
