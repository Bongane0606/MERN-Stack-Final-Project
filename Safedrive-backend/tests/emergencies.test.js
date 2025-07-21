const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Emergency = require('../models/emergency');

describe('Emergency Endpoints', () => {
  let adminUser, regularUser, adminToken, regularToken;

  beforeAll(async () => {
    // Create test users
    adminUser = await User.create({
      name: 'Emergency Admin',
      email: 'emergencyadmin@example.com',
      password: 'password123',
      phone: '5555555555',
      drivingLicense: 'DL55555555',
      role: 'admin'
    });

    regularUser = await User.create({
      name: 'Emergency User',
      email: 'emergencyuser@example.com',
      password: 'password123',
      phone: '6666666666',
      drivingLicense: 'DL66666666',
      emergencyContacts: [
        { name: 'Contact 1', phone: '1111111111', relationship: 'Family' }
      ]
    });

    // Get tokens
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'emergencyadmin@example.com',
        password: 'password123'
      });
    adminToken = adminLogin.body.token;

    const regularLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'emergencyuser@example.com',
        password: 'password123'
      });
    regularToken = regularLogin.body.token;
  });

  afterAll(async () => {
    await User.deleteMany();
    await Emergency.deleteMany();
  });

  describe('POST /api/v1/emergencies', () => {
    it('should create emergency for user', async () => {
      const emergencyData = {
        location: {
          type: 'Point',
          coordinates: [-118.243683, 34.052235],
          address: 'Los Angeles, CA'
        },
        emergencyType: 'accident'
      };

      const res = await request(app)
        .post('/api/v1/emergencies')
        .set('Authorization', `Bearer ${regularToken}`)
        .send(emergencyData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.emergencyType).toEqual('accident');
      expect(res.body.data.status).toEqual('active');
    });
  });

  describe('GET /api/v1/emergencies', () => {
    it('should get all emergencies for admin', async () => {
      const res = await request(app)
        .get('/api/v1/emergencies')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should not allow regular users to get all emergencies', async () => {
      const res = await request(app)
        .get('/api/v1/emergencies')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('POST /api/v1/emergencies/:id/respond', () => {
    it('should allow admin to respond to emergency', async () => {
      const emergency = await Emergency.findOne({ user: regularUser._id });
      const res = await request(app)
        .post(`/api/v1/emergencies/${emergency._id}/respond`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ responderType: 'police' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.responders.length).toBe(1);
    });
  });
});