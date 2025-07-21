const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Reward = require('../models/Reward');
const Redemption = require('../models/Redemption');

describe('Reward Endpoints', () => {
  let adminUser, regularUser, adminToken, regularToken;
  let reward1, reward2;

  beforeAll(async () => {
    // Create test users
    adminUser = await User.create({
      name: 'Reward Admin',
      email: 'rewardadmin@example.com',
      password: 'password123',
      phone: '3333333333',
      drivingLicense: 'DL33333333',
      role: 'admin'
    });

    regularUser = await User.create({
      name: 'Reward User',
      email: 'rewarduser@example.com',
      password: 'password123',
      phone: '4444444444',
      drivingLicense: 'DL44444444',
      points: 1000
    });

    // Create test rewards
    reward1 = await Reward.create({
      name: 'Fuel Discount',
      description: '10% off at participating gas stations',
      pointsRequired: 500,
      category: 'fuel'
    });

    reward2 = await Reward.create({
      name: 'Car Wash',
      description: 'Free premium car wash',
      pointsRequired: 300,
      category: 'service'
    });

    // Get tokens
    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'rewardadmin@example.com',
        password: 'password123'
      });
    adminToken = adminLogin.body.token;

    const regularLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'rewarduser@example.com',
        password: 'password123'
      });
    regularToken = regularLogin.body.token;
  });

  afterAll(async () => {
    await User.deleteMany();
    await Reward.deleteMany();
    await Redemption.deleteMany();
  });

  describe('GET /api/v1/rewards', () => {
    it('should get all active rewards', async () => {
      const res = await request(app)
        .get('/api/v1/rewards')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBe(2);
    });

    it('should filter rewards by category', async () => {
      const res = await request(app)
        .get('/api/v1/rewards?category=fuel')
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].category).toEqual('fuel');
    });
  });

  describe('POST /api/v1/rewards', () => {
    it('should create new reward for admin', async () => {
      const newReward = {
        name: 'Oil Change',
        description: 'Free oil change service',
        pointsRequired: 400,
        category: 'service'
      };

      const res = await request(app)
        .post('/api/v1/rewards')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newReward);

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.name).toEqual(newReward.name);
    });

    it('should not allow regular users to create rewards', async () => {
      const res = await request(app)
        .post('/api/v1/rewards')
        .set('Authorization', `Bearer ${regularToken}`)
        .send({
          name: 'Invalid Reward',
          description: 'Should not be created',
          pointsRequired: 100,
          category: 'other'
        });

      expect(res.statusCode).toEqual(403);
    });
  });

  describe('POST /api/v1/rewards/:id/redeem', () => {
    it('should allow user to redeem reward with enough points', async () => {
      const res = await request(app)
        .post(`/api/v1/rewards/${reward2._id}/redeem`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.pointsUsed).toEqual(reward2.pointsRequired);
      expect(res.body.data.redemptionCode).toBeDefined();
    });

    it('should not allow redemption without enough points', async () => {
      // Create a high-point reward
      const expensiveReward = await Reward.create({
        name: 'Expensive Reward',
        description: 'Very expensive reward',
        pointsRequired: 5000,
        category: 'other'
      });

      const res = await request(app)
        .post(`/api/v1/rewards/${expensiveReward._id}/redeem`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /api/v1/users/:id/rewards', () => {
    it('should get user reward redemptions', async () => {
      const res = await request(app)
        .get(`/api/v1/users/${regularUser._id}/rewards`)
        .set('Authorization', `Bearer ${regularToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
    });
  });
});