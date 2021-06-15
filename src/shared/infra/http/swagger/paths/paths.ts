import usersPath from './usersPath';
import forgotPasswordPath from './forgotPasswordPath';
import resetPasswordPath from './resetPasswordPath';
import authenticatePath from './authenticatePath';
import profilePath from './profilePath';
import refreshTokenPath from './refreshTokenPath';

const paths = {
  '/authenticate': authenticatePath,
  '/password/forgot': forgotPasswordPath,
  '/password/reset': resetPasswordPath,
  '/profile': profilePath,
  '/refresh-token': refreshTokenPath,
  '/users': usersPath,
};

export default paths;
