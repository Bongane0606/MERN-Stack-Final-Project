const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Trip = require('../models/Trip');

describe('Trip Endpoints', () => {
  let user1, user2, token1, token2;

  beforeAll(async () => {
    // Create test users
    user1 = await User.create({
      name: 'Trip User 1',
      email: 'trip1@example.com',
      password: 'password123',
      phone: '1111111111',
      drivingLicense: 'DL11111111'
    });

    user2 = await User.create({
      name: 'Trip User 2',
      email: 'trip2@example.com',
      password: 'password123',
      phone: '2222222222',
      drivingLicense: 'DL22222222'
    });

    // Create test trips
    await Trip.create([
      {
        user: user1._id,
        startTime: new Date(),
        startLocation: {
          type: 'Point',
          coordinates: [-118.243683, 34.052235],
          address: 'Los Angeles, CA'
        },
        distance: 10.5
      },
      {
        user: user2._id,
        startTime: new Date(),
        startLocation: {
          type: 'Point',
          coordinates: [-122.419416, 37.774929],
          address: 'San Francisco, CA'
        },
        distance: 5.2
      }
    ]);

    // Get tokens
    const login1 = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'trip1@example.com',
        password: 'password123'
      });
    token1 = login1.body.token;

    const login2 = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'trip2@example.com',
        password: 'password123'
      });
    token2 = login2.body.token;
  });

  afterAll(async () => {
    await User.deleteMany();
    await Trip.deleteMany();
  });

  describe('GET /api/v1/trips', () => {
    it('should only return trips for the logged in user', async () => {
      const res = await request(app)
        .get('/api/v1/trips')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].user).toEqual(user1._id.toString());
    });
  });

  describe('POST /api/v1/trips', () => {
    it('should create a new trip', async () => {
      const newTrip = {
        startTime: new Date(),
        startLocation: {
          type: 'Point',
          coordinates: [-117.161084, 32.715738],
          address: 'San Diego, CA'
        },
        distance: 8.3
      };

      const res = await request(app)
        .post('/api/v1/trips')
        .set('Authorization', `Bearer ${token1}`)
        .send(newTrip);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.user).toEqual(user1._id.toString());
    });
  });

  describe('GET /api/v1/trips/:id', () => {
    it('should get trip by ID for owner', async () => {
      const trip = await Trip.findOne({ user: user1._id });
      const res = await request(app)
        .get(`/api/v1/trips/${trip._id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data._id).toEqual(trip._id.toString());
    });

    it('should not allow access to other users trips', async () => {
      const trip = await Trip.findOne({ user: user2._id });
      const res = await request(app)
        .get(`/api/v1/trips/${trip._id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('PUT /api/v1/trips/:id', () => {
    it('should update trip for owner', async () => {
      const trip = await Trip.findOne({ user: user1._id });
      const updatedDistance = 12.7;
      const res = await request(app)
        .put(`/api/v1/trips/${trip._id}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ distance: updatedDistance });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.distance).toEqual(updatedDistance);
    });
  });
});