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

describe('AuthenticateUser Controller', () => {
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

  it('should be able to authenticate an existing user', async () => {
    const response = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
      password: 'password',
    });

    const { user, token } = response.body;

    expect(response.status).toBe(200);
    expect(token).not.toBeNull();
    expect(user.email).toEqual('email@supertest.com');
    expect(user.name).toEqual('Supertest');
    expect(user).toHaveProperty('avatarURL');
    expect(user).toHaveProperty('id');
    expect(user).not.toHaveProperty('avatar');
    expect(user).not.toHaveProperty('phoneNumber');
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('emailConfirmed');
    expect(user).not.toHaveProperty('phoneNumberConfirmed');
    expect(user).not.toHaveProperty('createdAt');
    expect(user).not.toHaveProperty('updatedAt');
  });

  it('should set refresh token cookie to expires in 30 days', async () => {
    const response = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
      password: 'password',
    });

    const { token } = response.body;

    const cookie = extractCookies(response.header);

    const rtid = cookie.rtid.value;
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
    expect(rtid).not.toBeNull();
    expect(expiresCookieFormatted).toEqual(expiresDateFormatted);
  });

  it('should set uid cookie', async () => {
    const response = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
      password: 'password',
    });

    const cookie = extractCookies(response.header);

    const uid = cookie.uid.value;

    expect(response.status).toBe(200);
    expect(uid).not.toBeNull();
  });

  it('should set access token to expires in 15 minutes', async () => {
    const response = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
      password: 'password',
    });

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
    expect(decodedToken.data.name).not.toBeNull();
    expect(decodedToken.data.email).not.toBeNull();
    expect(diffInMinutes).toEqual(15);
  });

  it('should not be able to authenticate a non-existing user', async () => {
    const response = await request(app).post('/authenticate').send({
      email: 'WRONG_email@supertest.com',
      password: 'password',
    });

    const { message } = response.body;
    expect(response.status).toBe(401);
    expect(message).toEqual('Incorrect email or password.');
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    const response = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
      password: 'WRONG_password',
    });

    const { message } = response.body;
    expect(response.status).toBe(401);
    expect(message).toEqual('Incorrect email or password.');
  });

  it('should not be able to authenticate without email body field', async () => {
    const response = await request(app).post('/authenticate').send({
      password: 'password',
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"email" is required');
  });

  it('should not be able to authenticate with an invalid email body field', async () => {
    const response = await request(app).post('/authenticate').send({
      email: 'email',
      password: 'password',
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"email" must be a valid email');
  });

  it('should not be able to authenticate without password body field', async () => {
    const response = await request(app).post('/authenticate').send({
      email: 'email@supertest.com',
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"password" is required');
  });
});
