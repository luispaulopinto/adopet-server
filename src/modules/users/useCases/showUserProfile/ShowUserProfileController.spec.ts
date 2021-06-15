import request from 'supertest';
import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import { hash } from 'bcrypt';

let connection: Connection;

describe('ShowUserProfile Controller', () => {
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

  it('should be able to get user profile from authenticated user', async () => {
    const sessionResponse = await request(app)
      .post('/authenticate')
      .send(userData);

    const { token } = sessionResponse.body;

    const response = await request(app)
      .get('/profile')
      .set({
        Authorization: `Bearer ${token}`,
      });

    const user = response.body;

    expect(response.status).toBe(200);
    expect(user.email).toEqual(userData.email);
    expect(user.name).toEqual(userData.name);
    expect(user.id).not.toBeNull();
    expect(user.createdAt).not.toBeNull();
    expect(user).toHaveProperty('avatarURL');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('phoneNumber');
    expect(user).toHaveProperty('uf');
    expect(user).toHaveProperty('city');
    expect(user).not.toHaveProperty('avatar');
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('emailConfirmed');
    expect(user).not.toHaveProperty('phoneNumberConfirmed');
    expect(user).not.toHaveProperty('updatedAt');
  });

  it('should NOT be able to get user profile without the authenticate token', async () => {
    const response = await request(app).get('/profile');

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to get user profile with an invalid authenticate token', async () => {
    const response = await request(app).get('/profile').set({
      Authorization: `Bearer TOKEN`,
    });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid JWT token.');
  });
});
