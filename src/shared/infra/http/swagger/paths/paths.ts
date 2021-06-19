import usersPath from './users/usersPath';
import forgotPasswordPath from './users/forgotPasswordPath';
import resetPasswordPath from './users/resetPasswordPath';
import authenticatePath from './users/authenticatePath';
import profilePath from './users/profilePath';
import refreshTokenPath from './users/refreshTokenPath';
import donationsPath from './donations/donationsPath';
import userDonationsPath from './donations/userDonationsPath';
import donationImagesPath from './donations/donationImagesPath';
import feedsPath from './feeds/feedsPath';

const paths = {
  '/authenticate': authenticatePath,
  '/password/forgot': forgotPasswordPath,
  '/password/reset': resetPasswordPath,
  '/profile': profilePath,
  '/refresh-token': refreshTokenPath,
  '/users': usersPath,
  'users/{:userId}/donations': userDonationsPath,
  '/donations': {
    post: donationsPath.post,
  },
  '/donations/{:donationId}': {
    put: donationsPath.put,
    patch: donationsPath.patch,
    get: donationsPath.get,
    delete: donationsPath.delete,
  },
  '/donations/{:donationId}/images': {
    delete: donationImagesPath.deleteAll,
  },
  '/donations/{:donationId}/images/{:imageId}': {
    delete: donationImagesPath.deleteById,
  },
  '/feeds': {
    get: feedsPath.get,
  },
};

export default paths;
