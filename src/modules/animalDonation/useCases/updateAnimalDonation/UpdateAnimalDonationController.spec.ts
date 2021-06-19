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

describe('Update Animal Donation Controller', () => {
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

  const animalImageData = {
    id: uuid(),
    animalDonationId: animalData.id,
    fileName: 'fileTest.jpg',
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

  it('should be able to update a donation without images', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        title: 'title updated',
        description: 'description updated',
        animalType: 'animalType updated',
        animalBreed: 'animalBreed updated',
        age: 2,
      });

    const animalDonation = response.body;

    expect(response.status).toBe(200);

    expect(animalDonation.id).not.toBeNull();
    expect(animalDonation.updatedAt).not.toBeNull();
    expect(animalDonation.images.length).toEqual(1);

    expect(animalDonation.title).toEqual('title updated');
    expect(animalDonation.description).toEqual('description updated');
    expect(animalDonation.animalType).toEqual('animalType updated');
    expect(animalDonation.animalBreed).toEqual('animalBreed updated');
    expect(animalDonation.age).toEqual(2);
  });

  it('should be able to update a donation with images', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
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
      })
      .field('title', 'title updated')
      .field('description', 'description updated')
      .field('animalType', 'animalType updated')
      .field('animalBreed', 'animalBreed updated')
      .field('age', 2);

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

    expect(response.status).toBe(200);

    expect(animalDonation.id).not.toBeNull();
    expect(animalDonation.updatedAt).not.toBeNull();
    expect(animalDonation.images).not.toBeNull();
    expect(animalDonation.images.length).toEqual(4);

    expect(animalDonation.title).toEqual('title updated');
    expect(animalDonation.description).toEqual('description updated');
    expect(animalDonation.animalType).toEqual('animalType updated');
    expect(animalDonation.animalBreed).toEqual('animalBreed updated');
    expect(animalDonation.age).toEqual(2);
  });

  it('should NOT be able to update a donation without the authenticate token', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
      .send({
        title: 'title updated',
        description: 'description updated',
        animalType: 'animalType updated',
        animalBreed: 'animalBreed updated',
        age: 2,
      });

    const { message } = response.body;

    expect(response.status).toBe(401);
    expect(message).toEqual('JWT token is missing.');
  });

  it('should NOT be able to update a donation with an invalid authenticate token', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
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

  it('should NOT be able to update a donation without title body field', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
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

  it('should NOT be able to update a donation without description body field', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
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

  it('should NOT be able to update a donation without animalType body field', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
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

  it('should NOT be able to update a donation without animalBreed body field', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
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

  it('should NOT be able to update a donation without age body field', async () => {
    const response = await request(app)
      .put(`/donations/${animalData.id}`)
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
