import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import routes from '../routes/index';
import authRoutes from '../routes/auth/index';
import { setHeadersForCORS } from '../helpers/response';
import User from '../models/User';

// Create test app
const createTestApp = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(setHeadersForCORS);
  app.use('/api/v1', routes);
  return app;
};

describe('Main Routes', () => {
  const app = createTestApp();

  test('GET /api/v1/ should return hello world message', async () => {
    const response = await request(app)
      .get('/api/v1/')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Hello World',
    });
  });

  test('GET /api/v1/nonexistent should return 404', async () => {
    const response = await request(app)
      .get('/api/v1/nonexistent')
      .expect(404);

    expect(response.body).toEqual({
      message: 'Not Found',
    });
  });

  test('should set CORS headers', async () => {
    const response = await request(app)
      .get('/api/v1/')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).toBe('*');
    expect(response.headers['access-control-allow-headers']).toBe(
      'Origin, X-Requested-With, X-Access-Token, Content-Type, Accept'
    );
  });
});

describe('Auth Routes', () => {
  const app = createTestApp();

  test('GET /api/v1/auth/ should return hello world auth message', async () => {
    const response = await request(app)
      .get('/api/v1/auth/')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Hello World auth',
    });
  });

  test('POST /api/v1/auth/register should create a new user', async () => {
    const userData = {
      username: 'testuser',
      password: 'password123',
      full_name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
    };

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject({
      success: true,
      message: 'User created.',
      data: {
        user: expect.objectContaining({
          username: userData.username,
          full_name: userData.full_name,
          role: 'student',
        }),
      },
    });

    // Verify user was created in database
    const user = await User.findOne({ where: { username: 'testuser' } });
    expect(user).toBeTruthy();
  });

  test('POST /api/v1/auth/register should return error for duplicate username', async () => {
    const userData = {
      username: 'duplicateuser',
      password: 'password123',
      full_name: 'Duplicate User',
    };

    // Create user first
    await User.create({ ...userData, role: 'student' });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      message: 'User already exists.',
    });
  });

  test('POST /api/v1/auth/login should authenticate user with correct credentials', async () => {
    const userData = {
      username: 'loginuser',
      password: 'password123',
      full_name: 'Login User',
      role: 'student' as const,
    };

    // Create user
    await User.create(userData);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'loginuser',
        password: 'password123',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Token created.',
      data: {
        token: expect.any(String),
      },
    });
  });

  test('POST /api/v1/auth/login should return error for invalid credentials', async () => {
    const userData = {
      username: 'invaliduser',
      password: 'correctpass',
      full_name: 'Invalid User',
      role: 'student' as const,
    };

    // Create user
    await User.create(userData);

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'invaliduser',
        password: 'wrongpass',
      })
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Authentication failed.',
    });
  });

  test('POST /api/v1/auth/login should return error for non-existent user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'nonexistent',
        password: 'password123',
      })
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      message: 'Authentication failed.',
    });
  });
});