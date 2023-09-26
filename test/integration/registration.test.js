require('dotenv').config();
const reqTest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const { DB_HOST_TEST, PORT } = process.env;

describe('registration new user', () => {
  beforeAll(async () => {
    console.log('Before all');
    await mongoose
      .connect(DB_HOST_TEST)
      .then(() => console.log('DB_TEST connected'))
      .catch(error => console.log(error));
  });

  afterAll(async () => {
    console.log('After all, disconnect from DB');
    await mongoose.disconnect(DB_HOST_TEST).then(() => {
      console.log('disconnected');
    });
  });

  it('should register new user', async () => {
    const response = await reqTest('http://localhost:3000/')
    // const response = await reqTest(app)
      .post('api/users/register')
      .send({ email: 'userbytest11@gmail.com', password: '123456' });

    expect(response.statusCode).toBe(201);
    expect(response.body.user.email).toBe('userbytest11@gmail.com');
  });
});
