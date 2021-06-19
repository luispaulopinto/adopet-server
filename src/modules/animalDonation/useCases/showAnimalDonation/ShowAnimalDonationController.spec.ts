import request from 'supertest';

import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';

import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let token: string;

describe('Show Animal Donation Controller', () => {
  const userData = {
    id: uuid(),
    email: 'email@supertest.com',
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

        INSERT INTO "AnimalDonation" ("Id", "UserId", "Title", "Description", "AnimalType", "AnimalBreed", "Age")
        VALUES(
          '${animalData.id}',
          '${userData.id}',
          '${animalData.title}',
          '${animalData.description}',
          '${animalData.animalType}',
          '${animalData.animalBreed}',
          '${animalData.age}');
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

  it('should be able to show animal donation', async () => {
    const response = await request(app)
      .get(`/donations/${animalData.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const animal = response.body;

    expect(response.status).toBe(200);

    expect(animal.id).not.toBeNull();
    expect(animal.updatedAt).not.toBeNull();
    expect(animal.title).toEqual('title');
    expect(animal.description).toEqual('description');
    expect(animal.animalType).toEqual('animalType');
    expect(animal.animalBreed).toEqual('animalBreed');
    expect(animal.age).toEqual('1');
  });

  it('should NOT be able to show animal donations without the authenticate token', async () => {
    const response = await request(app).get(`/donations/${animalData.id}`);

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to show animal donations with an invalid authenticate token', async () => {
    const response = await request(app).get(`/donations/${animalData.id}`).set({
      Authorization: `Bearer TOKEN`,
    });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid JWT token.');
  });
});
