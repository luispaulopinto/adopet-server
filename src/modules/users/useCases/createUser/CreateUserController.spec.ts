import request from 'supertest';

import { Connection } from 'typeorm';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('CreateUser Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Supertest',
      email: 'email@supertest.com',
      password: 'password',
    });

    expect(response.status).toBe(201);
    expect(response.body.id).not.toBeNull();
    expect(response.body.createdAt).not.toBeNull();
    expect(response.body.email).toEqual('email@supertest.com');
    expect(response.body.name).toEqual('Supertest');
    expect(response.body).toHaveProperty('avatarURL');
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).not.toHaveProperty('avatar');
    expect(response.body).not.toHaveProperty('phoneNumber');
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('emailConfirmed');
    expect(response.body).not.toHaveProperty('phoneNumberConfirmed');
    expect(response.body).not.toHaveProperty('updatedAt');
  });

  it('should not be able to create a new user with an already exists email', async () => {
    await request(app).post('/users').send({
      name: 'Supertest',
      email: 'email@supertest.com',
      password: 'password',
    });
    const response = await request(app).post('/users').send({
      name: 'Supertest',
      email: 'email@supertest.com',
      password: 'password',
    });
    const { message } = response.body;
    expect(response.status).toBe(409);
    expect(message).toEqual('Email already in use.');
  });

  it('should not be able to create a new user without email body field', async () => {
    const response = await request(app).post('/users').send({
      name: 'name',
      password: 'password',
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"email" is required');
  });

  it('should not be able to create a new user with an invalid email body field', async () => {
    const response = await request(app).post('/users').send({
      name: 'name',
      email: 'email',
      password: 'password',
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"email" must be a valid email');
  });

  it('should not be able to create a new user without name body field', async () => {
    const response = await request(app).post('/users').send({
      email: 'email@supertest.com',
      password: 'password',
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"name" is required');
  });

  it('should not be able to create a new user without password body field', async () => {
    const response = await request(app).post('/users').send({
      name: 'name',
      email: 'email@supertest.com',
    });

    const { message } = response.body;
    expect(response.status).toBe(400);
    expect(message).toEqual('"password" is required');
  });
});
