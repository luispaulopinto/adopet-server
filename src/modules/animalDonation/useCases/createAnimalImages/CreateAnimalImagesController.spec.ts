import request from 'supertest';

import { Connection } from 'typeorm';

import uploadConfig from '@config/upload';

import app from '@shared/infra/http/app';

import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';

import createConnection from '@shared/infra/typeorm';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

let connection: Connection;
let diskStorageProvider: DiskStorageProvider;
let token: string;

describe('Create Animal Images Controller', () => {
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

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    diskStorageProvider = new DiskStorageProvider();

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

  it('should be able to create a new images for donation', async () => {
    const response = await request(app)
      .patch(`/donations/${animalData.id}`)
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_01.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_02.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_03.jpg`,
      )
      .set({
        Authorization: `Bearer ${token}`,
      });

    const animalImages = response.body;

    await Promise.all(
      animalImages.map(async (image: { imageURL: string }) => {
        const fileNameSplit = image.imageURL.split('/');
        const filename = fileNameSplit[fileNameSplit.length - 1];

        await diskStorageProvider.deleteFile(
          `${uploadConfig.uploadsFolder}/${filename}`,
        );
      }),
    );

    expect(response.status).toBe(201);
    expect(animalImages.length).toBe(3);

    expect(animalImages[0].id).not.toBeNull();
  });

  it('should NOT be able to create animal images without the authenticate token', async () => {
    const response = await request(app)
      .patch(`/donations/${animalData.id}`)
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_01.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_02.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_03.jpg`,
      );

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to create animal images with an invalid authenticate token', async () => {
    const response = await request(app)
      .patch(`/donations/${animalData.id}`)
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_01.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_02.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_03.jpg`,
      )
      .set({
        Authorization: `Bearer TOKEN`,
      });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid JWT token.');
  });

  it('should NOT be able to create animal images with an invalid donation id', async () => {
    const response = await request(app)
      .patch(`/donations/00000000-0000-0000-0000-000000000000`)
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_01.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_02.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_03.jpg`,
      )
      .set({
        Authorization: `Bearer ${token}`,
      });

    const { message } = response.body;
    expect(response.status).toBe(404);
    expect(message).toEqual('Animal donation not found.');
  });

  it('should NOT be able to create animal images for a donation not related to the authenticated user', async () => {
    const sessionUser2Response = await request(app)
      .post('/authenticate')
      .send(userData2);

    const user2Token = sessionUser2Response.body.token;

    const response = await request(app)
      .patch(`/donations/${animalData.id}`)
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_01.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_02.jpg`,
      )
      .attach(
        'images',
        `${uploadConfig.tmpFolder}/test_files/animal_image_03.jpg`,
      )
      .set({
        Authorization: `Bearer ${user2Token}`,
      });

    const { message } = response.body;
    expect(response.status).toBe(401);
    expect(message).toEqual('User without credentials.');
  });
});
