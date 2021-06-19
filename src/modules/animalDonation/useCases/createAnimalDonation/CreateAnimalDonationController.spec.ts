import request from 'supertest';

import { Connection } from 'typeorm';

import uploadConfig from '@config/upload';

import app from '@shared/infra/http/app';

import { hash } from 'bcrypt';

import createConnection from '@shared/infra/typeorm';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';

let connection: Connection;
let diskStorageProvider: DiskStorageProvider;
let token: string;

describe('Create Animal Donation Controller', () => {
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

    const sessionResponse = await request(app)
      .post('/authenticate')
      .send(userData);

    token = sessionResponse.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new donation without images', async () => {
    const response = await request(app)
      .post('/donations')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'title',
        description: 'description',
        animalType: 'animalType',
        animalBreed: 'animalBreed',
        age: 1,
      });

    const animalDonation = response.body;

    expect(response.status).toBe(201);

    expect(animalDonation.id).not.toBeNull();
    expect(animalDonation.createdAt).not.toBeNull();
    expect(animalDonation.images).not.toBeNull();

    expect(animalDonation.images.length).toEqual(0);
    expect(animalDonation.title).toEqual('title');
    expect(animalDonation.description).toEqual('description');
    expect(animalDonation.animalType).toEqual('animalType');
    expect(animalDonation.animalBreed).toEqual('animalBreed');
    expect(animalDonation.age).toEqual(1);
  });

  it('should be able to create a new donation with images', async () => {
    const response = await request(app)
      .post('/donations')
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
      .field('title', 'title')
      .field('description', 'description')
      .field('animalType', 'animalType')
      .field('animalBreed', 'animalBreed')
      .field('age', 1)
      .set({
        Authorization: `Bearer ${token}`,
      });

    const animalDonation = response.body;

    await Promise.all(
      animalDonation.images.map(async (image: { imageURL: string }) => {
        const fileNameSplit = image.imageURL.split('/');
        const filename = fileNameSplit[fileNameSplit.length - 1];

        await diskStorageProvider.deleteFile(
          `${uploadConfig.uploadsFolder}/${filename}`,
        );
      }),
    );

    expect(response.status).toBe(201);

    expect(animalDonation.id).not.toBeNull();
    expect(animalDonation.createdAt).not.toBeNull();
    expect(animalDonation.images).not.toBeNull();
    expect(animalDonation.images.length).toEqual(3);

    expect(animalDonation.title).toEqual('title');
    expect(animalDonation.description).toEqual('description');
    expect(animalDonation.animalType).toEqual('animalType');
    expect(animalDonation.animalBreed).toEqual('animalBreed');
    expect(animalDonation.age).toEqual(1);
  });

  it('should NOT be able to create a donation without the authenticate token', async () => {
    const response = await request(app).post('/donations').send({
      title: 'title',
      description: 'description',
      animalType: 'animalType',
      animalBreed: 'animalBreed',
      age: 1,
    });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to to create a donation with an invalid authenticate token', async () => {
    const response = await request(app)
      .post('/donations')
      .set({
        Authorization: `Bearer TOKEN`,
      })
      .send({
        title: 'title',
        description: 'description',
        animalType: 'animalType',
        animalBreed: 'animalBreed',
        age: 1,
      });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('Invalid JWT token.');
  });

  it('should NOT be able to create a new donation without title body field', async () => {
    const response = await request(app)
      .post('/donations')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        description: 'description',
        animalType: 'animalType',
        animalBreed: 'animalBreed',
        age: 1,
      });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"title" is required');
  });

  it('should NOT be able to create a new donation without description body field', async () => {
    const response = await request(app)
      .post('/donations')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'title',
        animalType: 'animalType',
        animalBreed: 'animalBreed',
        age: 1,
      });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"description" is required');
  });

  it('should NOT be able to create a new donation without animalType body field', async () => {
    const response = await request(app)
      .post('/donations')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'title',
        description: 'description',
        animalBreed: 'animalBreed',
        age: 1,
      });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"animalType" is required');
  });

  it('should NOT be able to create a new donation without animalBreed body field', async () => {
    const response = await request(app)
      .post('/donations')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'title',
        description: 'description',
        animalType: 'animalType',
        age: 1,
      });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"animalBreed" is required');
  });

  it('should NOT be able to create a new donation without age body field', async () => {
    const response = await request(app)
      .post('/donations')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'title',
        description: 'description',
        animalType: 'animalType',
        animalBreed: 'animalBreed',
      });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"age" is required');
  });
});
