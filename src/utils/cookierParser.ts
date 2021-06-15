interface IHeaders {
  'set-cookie': string[];
}

interface IHeaderObject {
  [key: string]: {
    value: string;
    flags: {
      [key: string]: string | boolean;
    };
  };
}

const shapeFlags = (flags: string[]): Record<string, unknown> =>
  flags.reduce((shapedFlags, flag) => {
    const [flagName, rawValue] = flag.split('=');
    // edge case where a cookie has a single flag and "; " split results in trailing ";"
    const value = rawValue ? rawValue.replace(';', '') : true;
    return { ...shapedFlags, [flagName]: value };
  }, {});

const extractCookies = (headers: IHeaders): IHeaderObject => {
  const cookies = headers['set-cookie'] as string[]; // Cookie[]

  return cookies.reduce((shapedCookies, cookieString) => {
    const [rawCookie, ...flags] = cookieString.split('; ');
    const [cookieName, value] = rawCookie.split('=');
    return {
      ...shapedCookies,
      [cookieName]: { value, flags: shapeFlags(flags) },
    };
  }, {});
};

export default extractCookies;
