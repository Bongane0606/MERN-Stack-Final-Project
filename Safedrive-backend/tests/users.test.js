const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

describe('User Endpoints', () => {
  let adminUser, regularUser, adminToken, regularToken;

  beforeAll(async () => {
    // Create test users
    adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      phone: '1234567890',
      drivingLicense: 'DL12345678',
      role: 'admin'
    });

    regularUser = await User.create({
      name: 'Regular User',
      email: 'regular@example.com',
      password: 'password123',
      phone: '9876543210',
      drivingLicense: 'DL87654321'
    });

    // Get tokens
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });
    adminToken = adminLogin.body.token;

    const regularLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'regular@example.com',
        password: 'password123'
      });
    regularToken = regularLogin.body.token;
  });

  afterAll(async () => {
    await User.deleteMany();
  });

  describe('GET /api/v1/users', () => {
    it('should get all users for admin', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should not allow regular users to get all users', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should get user by ID for admin', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data._id).toEqual(regularUser._id.toString());
    });

    it('should allow users to get their own profile', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data._id).toEqual(regularUser._id.toString());
    });

    it('should not allow users to get other profiles', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${adminUser._id}`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('POST /api/v1/users', () => {
    it('should create new user for admin', async () => {
      const newUser = {
        name: 'New Test User',
        email: 'newtest@example.com',
        password: 'password123',
        phone: '5555555555',
        drivingLicense: 'DL55555555'
      };

      const res = await request(app)
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.email).toEqual(newUser.email);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user for admin', async () => {
      const updatedName = 'Updated Regular User';
      const res = await request(app)
        .put(`/api/v1/users/${regularUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: updatedName });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.name).toEqual(updatedName);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete user for admin', async () => {
      const userToDelete = await User.create({
        name: 'User to Delete',
        email: 'delete@example.com',
        password: 'password123',
        phone: '1111111111',
        drivingLicense: 'DL11111111'
      });

      const res = await request(app)
        .delete(`/api/v1/users/${userToDelete._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data).toEqual({});
    });
  });
});