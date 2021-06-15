const statusCode404 = {
  description:
    'The user was not found. The response will contain an Errors JSON Object with the specific error.',
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

export default statusCode404;
