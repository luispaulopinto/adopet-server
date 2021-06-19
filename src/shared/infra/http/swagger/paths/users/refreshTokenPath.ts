import {
  statusCode400,
  statusCode401,
  statusCode404,
  statusCode500,
} from '../../responses';

const refreshTokenPath = {
  post: {
    tags: ['Refresh Token'],
    summary: 'Refresh user token',
    // description: '',
    responses: {
      '200': {
        description:
          'The request was successfully. The response will contain a JSON body with user details.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
              example: {
                token: 'a32d8169-56ef-4d48-a2c1-a595ff748116',
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
  parameters: [
    {
      name: 'rtid',
      in: 'cookie',
      description: 'Refresh token to be passed as a cookie',
      required: true,
      schema: {
        type: 'string',
      },
      style: 'simple',
    },
    {
      name: 'uid',
      in: 'cookie',
      description: 'User id to be passed as a cookie',
      required: true,
      schema: {
        type: 'string',
      },
      style: 'simple',
    },
  ],
};

export default refreshTokenPath;
