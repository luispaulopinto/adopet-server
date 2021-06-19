import request from 'supertest';

import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';

import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let token: string;

describe('Delete All Animal Images Controller', () => {
  const userData = {
    id: uuid(),
    email: 'email@supertest.com',
    name: 'Supertest',
    password: 'password',
  };

  const userData2 = {
    id: uuid(),
    email: 'email2@supertest.com',
    name: 'Supertest',
    password: 'password',
  };

  const animalData = {
    id: uuid(),
    title: 'title',
    description: 'description',
    animalType: 'animalType',
    animalBreed: 'animalBreed',
    age: 1,
  };

  const animalImageData = {
    id: uuid(),
    animalDonationId: animalData.id,
    fileName: 'fileTest.jpg',
  };

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const password = await hash(userData.password, 8);

    await connection.query(
      `
        INSERT INTO "User" ("Id", "Name", "Email", "Password")
        VALUES(
          '${userData.id}',
          '${userData.name}',
          '${userData.email}',
          '${password}');

        INSERT INTO "User" ("Id", "Name", "Email", "Password")
          VALUES(
            '${userData2.id}',
            '${userData2.name}',
            '${userData2.email}',
            '${password}');

        INSERT INTO "AnimalDonation" ("Id", "UserId", "Title", "Description", "AnimalType", "AnimalBreed", "Age")
        VALUES(
          '${animalData.id}',
          '${userData.id}',
          '${animalData.title}',
          '${animalData.description}',
          '${animalData.animalType}',
          '${animalData.animalBreed}',
          '${animalData.age}');

        INSERT INTO "AnimalImage" ("Id", "AnimalDonationId", "FileName")
        VALUES(
          '${animalImageData.id}',
          '${animalImageData.animalDonationId}',
          '${animalImageData.fileName}');
        `,
    );

    const sessionResponse = await request(app)
      .post('/authenticate')
      .send(userData);

    token = sessionResponse.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to delete all animal images from a specfic donation', async () => {
    const response = await request(app)
      .delete(`/donations/${animalData.id}/images`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(204);
  });

  it('should NOT be able to delete all animal images from a non-existing donation', async () => {
    const response = await request(app)
      .delete(`/donations/00000000-0000-0000-0000-000000000000/images`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { message } = response.body;

    expect(response.status).toBe(404);
    expect(message).toEqual('Animal image not found.');
  });

  it('should NOT be able to delete all animal images from an user not relate to the donation', async () => {
    const sessionUser2Response = await request(app)
      .post('/authenticate')
      .send(userData2);

    const user2Token = sessionUser2Response.body.token;

    const response = await request(app)
      .delete(`/donations/${animalData.id}/images`)
      .set({
        Authorization: `Bearer ${user2Token}`,
      });

    const { message } = response.body;

    expect(response.status).toBe(404);
    expect(message).toEqual('Animal image not found.');
  });

  it('should NOT be able to delete all animal images without the authenticate token', async () => {
    const response = await request(app).delete(
      `/donations/${animalData.id}/images/${animalImageData.id}`,
    );

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to delete all animal images with an invalid authenticate token', async () => {
    const response = await request(app)
      .delete(`/donations/${animalData.id}/images/${animalImageData.id}`)
      .set({
        Authorization: `Bearer TOKEN`,
      });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid JWT token.');
  });
});
