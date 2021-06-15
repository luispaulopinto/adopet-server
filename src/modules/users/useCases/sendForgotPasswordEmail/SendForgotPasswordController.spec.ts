import request from 'supertest';
import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import { hash } from 'bcrypt';

import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';

let connection: Connection;

const mockSendMail = jest.fn().mockReturnValue(() => {
  return Promise.resolve();
});

describe('SendForgotPassword Controller', () => {
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
        VALUES('${userData.name}', '${userData.email}', '${password}')
      `,
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to send forgot password email.', async () => {
    jest
      .spyOn(EtherealMailProvider.prototype, 'sendEmail')
      .mockImplementation(mockSendMail);

    const response = await request(app)
      .post('/password/forgot')
      .send({ email: userData.email });

    expect(mockSendMail).toHaveBeenCalled();
    expect(response.status).toBe(204);
  });

  it('should NOT be able to send forgot password email WITHOUT email body request', async () => {
    const response = await request(app).post('/password/forgot').send();

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"email" is required');
  });

  it('should NOT be able to send forgot password email with an INVALID email body request', async () => {
    const response = await request(app)
      .post('/password/forgot')
      .send({ email: 'test' });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"email" must be a valid email');
  });
});
