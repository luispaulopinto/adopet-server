import request from 'supertest';
import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import { hash } from 'bcrypt';
import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import JwtProvider from '@shared/container/providers/JwtProvider/implementations/JwtProvider';
import extractCookies from '@utils/cookierParser';

let connection: Connection;
let dateProvider: DayjsDateProvider;
let jwtProvider: JwtProvider;

interface IToken {
  data: {
    name: string;
    email: string;
  };
  iat: number;
  exp: number;
  sub: string;
}

describe('RefreshToken Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    dateProvider = new DayjsDateProvider();
    jwtProvider = new JwtProvider();

    const password = await hash('password', 8);

    await connection.query(
      `INSERT INTO "User" ("Name", "Email", "Password")
        VALUES('Supertest', 'email@supertest.com', '${password}')
      `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to refresh token from an existing user', async () => {
    const session = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
      password: 'password',
    });

    const cookieSession = extractCookies(session.header);

    const rtIdSession = cookieSession.rtid.value;
    const uidSession = cookieSession.uid.value;

    const response = await request(app)
      .post('/refresh-token')
      .set('Cookie', [`rtid=${rtIdSession}`, `uid=${uidSession}`])
      .send();

    const { token } = response.body;

    const cookieRefreshToken = extractCookies(response.header);

    const rtId = cookieRefreshToken.rtid.value;
    const uid = cookieSession.uid.value;

    expect(response.status).toBe(200);
    expect(token).not.toBeNull();
    expect(rtId).not.toBeNull();
    expect(rtId).not.toEqual(rtIdSession);
    expect(uid).toEqual(uidSession);
  });

  it('should set refresh token cookie to expires in 30 days', async () => {
    const session = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
      password: 'password',
    });

    const cookieSession = extractCookies(session.header);

    const rtIdSession = cookieSession.rtid.value;
    const uidSession = cookieSession.uid.value;

    const response = await request(app)
      .post('/refresh-token')
      .set('Cookie', [`rtid=${rtIdSession}`, `uid=${uidSession}`])
      .send();

    const { token } = response.body;

    const cookie = extractCookies(response.header);

    const rtId = cookie.rtid.value;
    const uid = cookieSession.uid.value;
    const expiresCookie = new Date(cookie.rtid.flags.Expires as string);

    const expiresCookieFormatted = dateProvider.formatUtcDate(
      expiresCookie,
      'YYYY-MM-DDTHH:mm',
    );
    const expiresDate = dateProvider.addDays(30, dateProvider.dateNow());
    const expiresDateFormatted = dateProvider.formatUtcDate(
      expiresDate,
      'YYYY-MM-DDTHH:mm',
    );

    expect(response.status).toBe(200);
    expect(token).not.toBeNull();
    expect(rtId).not.toBeNull();
    expect(uid).toEqual(uidSession);
    expect(expiresCookieFormatted).toEqual(expiresDateFormatted);
  });

  it('should set access token to expires in 15 minutes', async () => {
    const session = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
      password: 'password',
    });

    const cookieSession = extractCookies(session.header);

    const rtIdSession = cookieSession.rtid.value;
    const uidSession = cookieSession.uid.value;

    const response = await request(app)
      .post('/refresh-token')
      .set('Cookie', [`rtid=${rtIdSession}`, `uid=${uidSession}`])
      .send();

    const { token } = response.body;

    const decodedToken = jwtProvider.verify(token) as IToken;

    const expiresDate = dateProvider.dateNow(decodedToken.exp * 1000);
    const issuedAtDate = dateProvider.dateNow(decodedToken.iat * 1000);

    const diffInMinutes = dateProvider.compareInMinutes(
      issuedAtDate,
      expiresDate,
    );

    expect(response.status).toBe(200);
    expect(decodedToken).not.toBeNull();
    expect(decodedToken.iat).not.toBeNull();
    expect(decodedToken.exp).not.toBeNull();
    expect(decodedToken.sub).not.toBeNull();
    expect(decodedToken.data).not.toBeNull();
    expect(diffInMinutes).toEqual(15);
  });

  it('should not be able to refresh token with an expired token (rtid nullable)', async () => {
    const response = await request(app).post('/refresh-token').send();

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('refresh token expired.');
  });
});
