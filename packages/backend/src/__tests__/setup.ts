import { db } from '../db/db';
import User from '../models/User';
import Class from '../models/Class';
import Post from '../models/Post';

beforeAll(async () => {
  // Ensure we're using test environment
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must be run with NODE_ENV=test');
  }
  
  // Connect to test database
  await db.authenticate();
  console.log('Connected to test database');
  
  // Sync models with force option to recreate tables
  await db.sync({ force: true });
});

afterAll(async () => {
  // Clean up database and close connection
  try {
    await db.close();
    console.log('Closed test database connection');
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
});

beforeEach(async () => {
  // Clean up data before each test but keep schema
  try {
    await User.destroy({ where: {}, truncate: true });
    await Class.destroy({ where: {}, truncate: true });
    await Post.destroy({ where: {}, truncate: true });
  } catch (error) {
    // Tables might not exist yet, that's okay
    console.log('Tables not yet created, skipping cleanup');
  }
});