import { statusCode400, statusCode401, statusCode500 } from '../../responses';

const feedsPath = {
  get: {
    tags: ['Feeds'],
    summary: 'Show animal feeds',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'limit',
        in: 'query',
        description: 'Limit items per page',
        schema: {
          type: 'number',
        },
      },
      {
        name: 'page',
        in: 'query',
        description: 'Page to show',
        schema: {
          type: 'number',
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
                limit: {
                  type: 'number',
                },
                page: {
                  type: 'string',
                },
                pageCount: {
                  type: 'string',
                },
                total: {
                  type: 'string',
                },
                links: {
                  type: 'object',
                  properties: {
                    self: {
                      type: 'number',
                    },
                    first: {
                      type: 'number',
                    },
                    last: {
                      type: 'number',
                    },
                    next: {
                      type: 'number',
                    },
                    previous: {
                      type: 'number',
                    },
                  },
                },
                results: {
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
                },
              },
              example: {
                limit: 3,
                page: 2,
                pageCount: 3,
                total: 8,
                links: {
                  self: '/feeds/limit=3&page=2',
                  first: '/feeds/limit=3&page=1',
                  last: '/feeds/limit=3&page=3',
                  next: '/feeds/limit=3&page=3',
                  previous: '/feeds/limit=3&page=1',
                },
                results: [
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
};

export default feedsPath;
