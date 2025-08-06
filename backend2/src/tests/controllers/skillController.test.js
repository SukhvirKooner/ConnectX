const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../../app');
const Skill = require('../../models/skillModel');
const UserSkill = require('../../models/userSkillModel');
const User = require('../../models/userModel');
const { generateAccessToken } = require('../../utils/jwtUtils');

let mongoServer;
let token;
let userId;
let skillId;
let userSkillId;

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRE = '1h';

// Setup before tests
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create test user
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password_hash: 'password123',
    title: 'Software Developer',
    company: 'Test Company',
    location: 'Test City'
  });
  userId = user._id;
  
  // Generate token for authentication
  token = generateAccessToken({ _id: userId });

  // Create test skill
  const skill = await Skill.create({
    name: 'JavaScript',
    category: 'Programming Languages'
  });
  skillId = skill._id;
});

// Clean up after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Skill Controller', () => {
  describe('GET /api/skills', () => {
    it('should get all skills', async () => {
      const res = await request(app)
        .get('/api/skills')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.items.length).toBeGreaterThan(0);
    });

    it('should filter skills by category', async () => {
      const res = await request(app)
        .get('/api/skills?category=Programming%20Languages')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.items[0].category).toBe('Programming Languages');
    });

    it('should search skills by name', async () => {
      const res = await request(app)
        .get('/api/skills?search=JavaScript')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.items[0].name).toBe('JavaScript');
    });
  });

  describe('GET /api/skills/:id', () => {
    it('should get skill by ID', async () => {
      const res = await request(app)
        .get(`/api/skills/${skillId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data._id.toString()).toBe(skillId.toString());
      expect(res.body.data.name).toBe('JavaScript');
    });

    it('should return 404 for non-existent skill ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/skills/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/skills/user', () => {
    it('should add skill to user profile', async () => {
      const res = await request(app)
        .post('/api/skills/user')
        .set('Authorization', `Bearer ${token}`)
        .send({ skill_id: skillId });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.user_id.toString()).toBe(userId.toString());
      expect(res.body.data.skill_id._id.toString()).toBe(skillId.toString());
      
      // Save user skill ID for later tests
      userSkillId = res.body.data._id;
    });

    it('should return 400 when trying to add the same skill again', async () => {
      const res = await request(app)
        .post('/api/skills/user')
        .set('Authorization', `Bearer ${token}`)
        .send({ skill_id: skillId });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent skill ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post('/api/skills/user')
        .set('Authorization', `Bearer ${token}`)
        .send({ skill_id: nonExistentId });
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/skills/user/:userId', () => {
    it('should get user skills', async () => {
      const res = await request(app)
        .get(`/api/skills/user/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.items[0].user_id.toString()).toBe(userId.toString());
    });

    it('should return 404 for non-existent user ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/skills/user/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/skills/endorse/:userSkillId', () => {
    // Create another user to endorse the skill
    let endorserToken;
    let endorserId;

    beforeAll(async () => {
      const endorser = await User.create({
        name: 'Endorser User',
        email: 'endorser@example.com',
        password_hash: 'password123',
        title: 'Senior Developer',
        company: 'Endorser Company',
        location: 'Endorser City'
      });
      endorserId = endorser._id;
      endorserToken = generateAccessToken({ _id: endorserId });
    });

    it('should endorse a user skill', async () => {
      const res = await request(app)
        .post(`/api/skills/endorse/${userSkillId}`)
        .set('Authorization', `Bearer ${endorserToken}`);
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.endorsement).toBeDefined();
      expect(res.body.data.endorsement.user_skill_id.toString()).toBe(userSkillId.toString());
      expect(res.body.data.endorsement.endorser_id.toString()).toBe(endorserId.toString());
      expect(res.body.data.endorsements_count).toBe(1);
    });

    it('should return 400 when trying to endorse the same skill again', async () => {
      const res = await request(app)
        .post(`/api/skills/endorse/${userSkillId}`)
        .set('Authorization', `Bearer ${endorserToken}`);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when trying to endorse own skill', async () => {
      const res = await request(app)
        .post(`/api/skills/endorse/${userSkillId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/skills/endorsements/:userSkillId', () => {
    it('should get skill endorsements', async () => {
      const res = await request(app)
        .get(`/api/skills/endorsements/${userSkillId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items).toBeDefined();
      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.items[0].user_skill_id.toString()).toBe(userSkillId.toString());
    });

    it('should return 404 for non-existent user skill ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/skills/endorsements/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/skills/user/:id', () => {
    it('should remove skill from user profile', async () => {
      const res = await request(app)
        .delete(`/api/skills/user/${userSkillId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 404 for non-existent user skill ID', async () => {
      const res = await request(app)
        .delete(`/api/skills/user/${userSkillId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});