import securitySchemes from './components/securitySchemes';
import info from './info/info';
import paths from './paths/paths';
import tags from './tags/tags';

const x = {
  openapi: '3.0.0',
  info,
  tags,
  paths,
  components: {
    securitySchemes,
  },
};

export default x;
