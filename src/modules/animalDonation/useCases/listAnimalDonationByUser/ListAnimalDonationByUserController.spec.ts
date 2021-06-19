import request from 'supertest';

import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';

import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let token: string;

describe('List Animal Donation By User Controller', () => {
  const userData = {
    id: uuid(),
    email: 'email@supertest.com',
    name: 'Supertest',
    password: 'password',
  };

  const animalData1 = {
    id: uuid(),
    title: 'title',
    description: 'description',
    animalType: 'animalType',
    animalBreed: 'animalBreed',
    age: 1,
  };

  const animalData2 = {
    id: uuid(),
    title: 'title 2',
    description: 'description 2',
    animalType: 'animalType 2',
    animalBreed: 'animalBreed 2',
    age: 2,
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
          '${animalData1.id}',
          '${userData.id}',
          '${animalData1.title}',
          '${animalData1.description}',
          '${animalData1.animalType}',
          '${animalData1.animalBreed}',
          '${animalData1.age}');

        INSERT INTO "AnimalDonation" ("Id", "UserId", "Title", "Description", "AnimalType", "AnimalBreed", "Age")
        VALUES(
          '${animalData2.id}',
          '${userData.id}',
          '${animalData2.title}',
          '${animalData2.description}',
          '${animalData2.animalType}',
          '${animalData2.animalBreed}',
          '${animalData2.age}');
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

  it('should be able to list users donations', async () => {
    const response = await request(app)
      .get(`/users/${userData.id}/donations`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const animals = response.body;

    expect(response.status).toBe(200);

    expect(animals.length).toBe(2);
    expect(animals[0].id).not.toBeNull();
    expect(animals[0].updatedAt).not.toBeNull();
  });

  it('should NOT be able to list animals donations without the authenticate token', async () => {
    const response = await request(app).get(`/users/${userData.id}/donations`);

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to list animals donations with an invalid authenticate token', async () => {
    const response = await request(app)
      .get(`/users/${userData.id}/donations`)
      .set({
        Authorization: `Bearer TOKEN`,
      });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid JWT token.');
  });
});
