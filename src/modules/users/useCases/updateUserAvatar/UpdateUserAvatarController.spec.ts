import request from 'supertest';

import { Connection } from 'typeorm';

import uploadConfig from '@config/upload';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import { hash } from 'bcrypt';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

let connection: Connection;
let diskStorageProvider: DiskStorageProvider;

describe('UpdateUserAvatar Controller', () => {
  const userData = {
    email: 'email@supertest.com',
    name: 'Supertest',
    password: 'password',
  };

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    diskStorageProvider = new DiskStorageProvider();

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

  it('should be able to add an user avatar', async () => {
    const sessionResponse = await request(app)
      .post('/authenticate')
      .send(userData);

    const { token } = sessionResponse.body;

    const response = await request(app)
      .patch('/users/avatar')
      .attach(
        'avatar',
        `${uploadConfig.tmpFolder}/image_test.jpg`,
      )
      .set({
        Authorization: `Bearer ${token}`,
      });

    const user = response.body;

    await diskStorageProvider.deleteFile(
      `${uploadConfig.uploadsFolder}/${user.avatar}`,
    );

    expect(response.status).toBe(200);
    expect(user.email).toEqual(userData.email);
    expect(user.name).toEqual(userData.name);
    expect(user.id).not.toBeNull();
    expect(user.updatedAt).not.toBeNull();
    expect(user).toHaveProperty('avatarURL');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('updatedAt');
    expect(user).not.toHaveProperty('phoneNumber');
    expect(user).toHaveProperty('avatar');
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('emailConfirmed');
    expect(user).not.toHaveProperty('phoneNumberConfirmed');
    expect(user).not.toHaveProperty('createdAt');
  });

  it('should NOT be able to add a non-image file', async () => {
    const sessionResponse = await request(app)
      .post('/authenticate')
      .send(userData);

    const { token } = sessionResponse.body;

    const response = await request(app)
      .patch('/users/avatar')
      .attach('avatar', `${uploadConfig.tmpFolder}/test.txt`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { message } = response.body;

    expect(response.status).toBe(400);
    expect(message).toEqual('Only .png, .jpg and .jpeg format allowed.');
  });

  it('should NOT be able to add an user avatar without the authenticate token', async () => {
    const response = await request(app).patch('/users/avatar');

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to add an user avatar with an invalid authenticate token', async () => {
    const response = await request(app).patch('/users/avatar').set({
      Authorization: `Bearer TOKEN`,
    });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid JWT token.');
  });
});
