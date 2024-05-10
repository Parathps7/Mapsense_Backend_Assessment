const request = require('supertest');
const app = require('../index');
require('dotenv').config()

let authToken,token;
describe('Test user routes', () => {
  // Test user registration
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'user1',
        email: 'safayaparath@gmail.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(201);
  });

    // Test user login
    it('should login a user and get auth token', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'safayaparath@gmail.com',
          password: 'password'
        });
      expect(res.statusCode).toEqual(200);
      authToken = res.body.accesstoken; // Save auth token for further requests
    });
    console.log(authToken);
  // Test forgot password
  it('should initiate forgot password process', async () => {
    const res = await request(app)
      .post('/api/users/forget-password')
      .send({
        email: 'safayaparath@gmail.com'
      });
    expect(res.statusCode).toEqual(200);
    token = res.body.token;
  });

  // Test reset password -- User will get token through mail,but we are for testing purpose getting token through forget-password's response body
  it('should reset user password', async () => {
    // Assuming you have some way to get the reset token
    const res = await request(app)
      .post(`/api/users/reset-password/${token}`)
      .send({
        password: 'newpassword'
      });
    expect(res.statusCode).toEqual(200);
  });


  // Test current user 
  it('should view current users', async () => {
    // Assuming you have some way to get the reset token
    const res = await request(app)
      .get(`/api/users/current`)
      .set('Authorization', `Bearer ${authToken}`)
    expect(res.statusCode).toEqual(200);
  });

});


describe('Test User Endpoints', () => {
  let image_id;
  it('should create a new location', async () => {
    const res = await request(app)
      .post('/api/location/add')
      .send({ latitude: 27.7749, longitude: -152.4194 })
      .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toEqual(201);
  });

  it('should create another new location', async () => {
    const res = await request(app)
      .post('/api/location/add')
      .send({ latitude: 20.0, longitude: -15.034 })
      .set('Authorization', `Bearer ${authToken}`)

      expect(res.statusCode).toEqual(201);
      image_id = res.body.Location._id;
  });

  it('should view locations', async () => {
    const res = await request(app)
      .get('/api/location/view')
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.statusCode).toBe(200);
    expect(res.body);
  });

  it('should delete a location', async () => {
    const res = await request(app)
      .delete(`/api/location/delete/${image_id}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.statusCode).toBe(200);
    expect(res.body);
  });

  it('should calculate distance between two coordinates', async () => {
    const response = await request(app)
      .post('/api/distance')
      .send({
        coordinate1: { latitude: 37.7749, longitude: -122.4194 },
        coordinate2: { latitude: 40.7128, longitude: -74.0060 }
      })
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('Distance in Meters');
  });

  it('should find the closest location', async () => {
    const response = await request(app)
      .post('/api/closest')
      .send({ latitude: 37.7749, longitude: -122.4194 })
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.statusCode).toBe(200);
    expect(response.body);
  });


});
