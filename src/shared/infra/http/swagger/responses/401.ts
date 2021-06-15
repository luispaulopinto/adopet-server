const statusCode401 = {
  description:
    'You did not supply a valid Authorization header, the header was omitted or your access token is expired / invalid. The response will contain an Errors JSON Object with the specific error.',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
        // example: {
        //   status: 'error',
        //   message: '"Email" is required.',
        // },
      },
    },
  },
};

export default statusCode401;
