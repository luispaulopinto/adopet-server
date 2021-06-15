export default {
  token: {
    secret: process.env.JWT_SECRET || '',
    expiresInToken: process.env.ACCESS_TOKEN_EXPIRES || '15m',
    expiresRefreshTokenDays:
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS) || 30,
    expiresResetTokenHours:
      Number(process.env.RESET_TOKEN_EXPIRES_IN_HOURS) || 2,
  },
};
