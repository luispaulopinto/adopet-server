import request from 'supertest';
import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import { hash } from 'bcrypt';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';

import crypto from 'crypto';

let connection: Connection;

const mockToken = '00000000-0000-0000-0000-000000000000';

jest.mock('uuid', () => ({
  v4: (): string => mockToken,
}));

const mockSendMail = jest.fn().mockReturnValue(() => {
  return Promise.resolve();
});

describe('ResetPassword Controller', () => {
  const userData = {
    email: 'email@supertest.com',
    name: 'Supertest',
    password: 'password',
  };

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash(userData.password, 8);

    await connection.query(
      `INSERT INTO "User" ("Name", "Email", "Password")
        VALUES( '${userData.name}', '${userData.email}', '${password}');
      `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to reset the user password', async () => {
    jest
      .spyOn(EtherealMailProvider.prototype, 'sendEmail')
      .mockImplementation(mockSendMail);

    jest.spyOn(crypto, 'randomBytes').mockImplementationOnce(() => mockToken);

    await request(app).post('/password/forgot').send({ email: userData.email });

    const response = await request(app).post('/password/reset').send({
      password: 'newPassword',
      token: mockToken,
    });

    expect(response.status).toBe(204);
  });

  it('should NOT be able to reset the user password with a WRONG token', async () => {
    jest
      .spyOn(EtherealMailProvider.prototype, 'sendEmail')
      .mockImplementation(mockSendMail);

    jest.spyOn(crypto, 'randomBytes').mockImplementationOnce(() => mockToken);

    await request(app).post('/password/forgot').send({ email: userData.email });

    const response = await request(app).post('/password/reset').send({
      password: 'newPassword',
      token: '00000000-0000-0000-0000-000000000001',
    });

    const { message } = response.body;
    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid Token.');
  });

  it('should NOT be able to reset the password user without the password request body', async () => {
    const response = await request(app).post('/password/reset').send({
      token: mockToken,
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"password" is required');
  });

  it('should NOT be able to reset the password user without the reset token request body', async () => {
    const response = await request(app).post('/password/reset').send({
      password: 'newPassword',
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"token" is required');
  });
});
