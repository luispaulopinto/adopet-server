import {
  statusCode400,
  statusCode401,
  statusCode404,
  statusCode500,
} from '../../responses';

const donationsPath = {
  post: {
    tags: ['Donations'],
    summary: 'Create a new animal donation with images.',
    security: [{ bearerAuth: [] }],
    requestBody: {
      description: 'Required fields to create a donation.',
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
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
              images: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
        },
      },
    },
    responses: {
      '201': {
        description:
          'Donation created successfully. The response will contain a JSON body with user details.',
        content: {
          'application/json': {
            schema: {
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
              example: {
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
                ],
              },
            },
          },
        },
      },
      '400': statusCode400,
      '401': statusCode401,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
  patch: {
    tags: ['Donations'],
    summary: 'Update an animal donation with new images.',
    security: [{ bearerAuth: [] }],
    requestBody: {
      description: 'Required fields to add new images.',
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              images: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
        },
      },
    },
    responses: {
      '201': {
        description:
          'Animal Images created successfully. The response will contain a JSON body with user details.',
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
                  updateAt: {
                    type: 'string',
                  },
                  imageURL: {
                    type: 'string',
                  },
                },
              },
              example: [
                {
                  id: '47d97677-0bea-4d6c-99f2-c99cf3c93069',
                  createdAt: '2021-06-17T22:45:59.836Z',
                  imageURL: 'http://example.com/files/image_01.jpg',
                },
              ],
            },
          },
        },
      },
      '400': statusCode400,
      '401': statusCode401,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
  put: {
    tags: ['Donations'],
    summary: 'Update an animal donation',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'donationId',
        in: 'path',
        description: 'Donation id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      description: 'Required fields to update a donation.',
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
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
              images: {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary',
                },
              },
            },
          },
        },
      },
    },
    responses: {
      '201': {
        description:
          'Donation updated successfully. The response will contain a JSON body with user details.',
        content: {
          'application/json': {
            schema: {
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
                updatedAt: {
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
              example: {
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
                ],
              },
            },
          },
        },
      },
      '400': statusCode400,
      '404': statusCode404,
      '500': statusCode500,
    },
  },
  get: {
    tags: ['Donations'],
    summary: 'Show animal for donation',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'donationId',
        in: 'path',
        description: 'Donation id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      '200': {
        description:
          'Operation successfully. The response will contain a JSON body with user details.',
        content: {
          'application/json': {
            schema: {
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
              example: {
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
            },
          },
        },
      },
      '400': statusCode400,
      '401': statusCode401,
      '500': statusCode500,
    },
  },
  delete: {
    tags: ['Donations'],
    summary: 'Delete animal for donation',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'donationId',
        in: 'path',
        description: 'Donation id',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      '204': {
        description:
          'Donation deleted successfully. The response will contain a JSON body with user details.',
      },
      '400': statusCode400,
      '401': statusCode401,
      '500': statusCode500,
    },
  },
};

export default donationsPath;
