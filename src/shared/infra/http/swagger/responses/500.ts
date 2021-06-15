const statusCode500 = {
  description:
    'There was an internal error. The response will contain a JSON body with error details.',
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
        //   status: 'Internal Server Error',
        //   message:
        //     'Please try again later or feel free to contact us if the problem persists.',
        // },
      },
    },
  },
};

export default statusCode500;
