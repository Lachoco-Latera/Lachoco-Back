export const exampleCreatedUser = {
  id: 'b96c699b-a48b-42e8-8b50-492bdafc4337',
  name: 'tomas',
  lastname: 'lopez',
  email: 'lopez@gmail.com',
  isActive: true,
  role: 'ADMIN',
  orders: [],
};
export const userAlreadyExists = {
  status: 409,
  description: 'El usuario ya existe',
  schema: {
    example: {
      message: 'User already exists',
      error: 'Conflict',
      statusCode: 409,
    },
  },
};

export const userValidationsErrors = [
  {
    statusCode: 400,
    message: [
      'email must be an email',
      'email should not be empty',
      'email must be a string',
    ],
    error: 'Bad Request',
  },
  {
    message: [
      'firstName must be shorter than or equal to 50 characters',
      'firstName should not be empty',
      'firstName must be a string',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: [
      'lastName must be a string',
      'lastName should not be empty',
      'lastName must be shorter than or equal to 50 characters',
    ],
    error: 'Bad Request',
    statusCode: 400,
  },
  {
    message: ['Usuario es requerido'],
    error: 'Bad Request',
    statusCode: 400,
  },
];
