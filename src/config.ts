import * as fs from 'fs';

if (!process.env.NODE_ENV) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}

export default () => ({
  mongoUrl: process.env.DB_URL,
  port: process.env.PORT,
  jwt: {
    tokenExpirationTime: process.env.JWT_TOKEN_EXPIRATION_TIME,
    refreshTokenExpirationTime: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    secretKey: fs.readFileSync(`${__dirname}/../key.JWT`, {
      encoding: 'utf-8',
    }),
  },
});
