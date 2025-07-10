import { db } from '../db/db';
import User from '../models/User';
import Class from '../models/Class';
import Post from '../models/Post';

describe('Database Connection', () => {
  test('should connect to test database', async () => {
    await expect(db.authenticate()).resolves.not.toThrow();
  });

  test('should sync models without errors', async () => {
    await expect(db.sync({ force: true })).resolves.not.toThrow();
  });
});

describe('User Model', () => {
  test('should create a user with valid data', async () => {
    const userData = {
      username: 'testuser',
      password: 'password123',
      full_name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      role: 'student' as const,
    };

    const user = await User.create(userData);
    
    expect(user.dataValues.username).toBe(userData.username);
    expect(user.dataValues.password).toBe(userData.password);
    expect(user.dataValues.full_name).toBe(userData.full_name);
    expect(user.dataValues.avatar).toBe(userData.avatar);
    expect(user.dataValues.role).toBe(userData.role);
    expect(user.dataValues.id).toBeDefined();
  });

  test('should find user by username', async () => {
    const userData = {
      username: 'finduser',
      password: 'password123',
      full_name: 'Find User',
      role: 'teacher' as const,
    };

    await User.create(userData);
    
    const foundUser = await User.findOne({ where: { username: 'finduser' } });
    
    expect(foundUser).toBeTruthy();
    expect(foundUser?.dataValues.username).toBe(userData.username);
    expect(foundUser?.dataValues.role).toBe(userData.role);
  });

  test('should validate required fields', async () => {
    const invalidData = {
      // Missing required username
      password: 'password123',
      full_name: 'Test User',
    };

    await expect(User.create(invalidData as any)).rejects.toThrow();
  });
});

describe('Class Model', () => {
  test('should create a class with valid data', async () => {
    const classData = {
      name: 'Math 101',
      description: 'Basic Mathematics',
      teacher_id: 1,
      student_ids: [1, 2, 3],
    };

    const classInstance = await Class.create(classData);
    
    expect(classInstance.dataValues.name).toBe(classData.name);
    expect(classInstance.dataValues.description).toBe(classData.description);
    expect(classInstance.dataValues.teacher_id).toBe(classData.teacher_id);
    expect(classInstance.dataValues.student_ids).toEqual(classData.student_ids);
  });
});

describe('Post Model', () => {
  test('should create a post with valid data', async () => {
    const postData = {
      name: 'Assignment 1',
      description: 'Complete the math homework',
      teacher_id: 1,
    };

    const post = await Post.create(postData);
    
    expect(post.dataValues.name).toBe(postData.name);
    expect(post.dataValues.description).toBe(postData.description);
    expect(post.dataValues.teacher_id).toBe(postData.teacher_id);
  });
});