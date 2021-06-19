import { statusCode400, statusCode401, statusCode500 } from '../../responses';

const donationsPath = {
  get: {
    tags: ['User Donations'],
    summary: 'List all animals for donation by user',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'userId',
        in: 'path',
        description: 'User id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      '201': {
        description:
          'Donation created successfully. The response will contain a JSON body with user details.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    format: 'uuid',
                  },
                  title: {
                    type: 'string',
                  },
                  description: {
                    type: 'string',
                  },
                  animalType: {
                    type: 'string',
                  },
                  animalBreed: {
                    type: 'string',
                  },
                  age: {
                    type: 'number',
                  },
                  updateAt: {
                    type: 'string',
                    format: 'date-time',
                  },
                  images: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          format: 'uuid',
                        },
                        updateAt: {
                          type: 'string',
                        },
                        imageURL: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
              example: [
                {
                  id: 'a32d8169-56ef-4d48-a2c1-a595ff748116',
                  title: 'Doação cachorro',
                  description: 'Cachorro a procura de um dono',
                  animalType: 'Cachorro',
                  animalBreed: 'Vira-Lata',
                  age: 1,
                  updateAt: '2012-03-10T22:10:32.992Z',
                  images: [
                    {
                      id: '47d97677-0bea-4d6c-99f2-c99cf3c93069',
                      createdAt: '2021-06-17T22:45:59.836Z',
                      imageURL: 'http://example.com/files/image_01.jpg',
                    },
                    {
                      id: 'd0565a37-ac35-4233-a319-fe4037703ac7',
                      createdAt: '2021-06-17T22:45:59.836Z',
                      imageURL: 'http://example.com/files/image_02.jpg',
                    },
                  ],
                },
                {
                  id: 'c32d8169-56ef-4d48-a2c1-a595ff748116',
                  title: 'Doação gato',
                  description: 'Gato a procura de um dono',
                  animalType: 'Gato',
                  animalBreed: 'Vira-Lata',
                  age: 1,
                  updateAt: '2012-03-10T22:10:32.992Z',
                  images: [],
                },
              ],
            },
          },
        },
      },
      '400': statusCode400,
      '401': statusCode401,
      '500': statusCode500,
    },
  },
};

export default donationsPath;
