import request from 'supertest';
import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import { hash } from 'bcrypt';

let connection: Connection;

describe('UpdateUserProfileUser Controller', () => {
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

  it('should be able to update user profile from the authenticated user', async () => {
    const sessionResponse = await request(app)
      .post('/authenticate')
      .send(userData);

    const { token } = sessionResponse.body;

    const response = await request(app)
      .put('/profile')
      .send({
        name: userData.name,
        email: userData.email,
        oldPassword: userData.password,
        password: 'password1',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    userData.password = 'password1';

    const user = response.body;

    expect(response.status).toBe(200);
    expect(user.email).toEqual(userData.email);
    expect(user.name).toEqual(userData.name);
    expect(user.id).not.toBeNull();
    expect(user.updatedAt).not.toBeNull();
    expect(user).toHaveProperty('avatarURL');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('updatedAt');
    expect(user).toHaveProperty('uf');
    expect(user).toHaveProperty('city');
    expect(user).toHaveProperty('avatar');
    expect(user).not.toHaveProperty('phoneNumber');
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('emailConfirmed');
    expect(user).not.toHaveProperty('phoneNumberConfirmed');
    expect(user).not.toHaveProperty('createdAt');
  });

  it('should NOT be able to update user profile without the authenticate token', async () => {
    const response = await request(app).put('/profile');

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to update user profile with an invalid authenticate token', async () => {
    const response = await request(app).put('/profile').set({
      Authorization: `Bearer TOKEN`,
    });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid JWT token.');
  });
});
