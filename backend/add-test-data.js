/**
 * Script to add test news events to the database
 * This will help us see the Globe working with actual markers
 */

const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27018/aya';

const testEvents = [
  {
    _id: 'test_1',
    title: 'Breaking: Major Climate Summit in New York',
    description: 'World leaders gather to discuss urgent climate action and renewable energy initiatives.',
    eventType: 'news_event',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    priority: 9,
    published_at: new Date(),
    source: 'Global News Network',
    url: 'https://example.com/climate-summit',
    category: 'environment'
  },
  {
    _id: 'test_2', 
    title: 'Tech Innovation Hub Opens in Tokyo',
    description: 'New technology center focuses on AI research and sustainable development.',
    eventType: 'news_event',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    priority: 6,
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    source: 'Tech Today',
    url: 'https://example.com/tokyo-tech',
    category: 'technology'
  },
  {
    _id: 'test_3',
    title: 'Peace Talks Resume in Geneva',
    description: 'International diplomats work toward conflict resolution and humanitarian aid.',
    eventType: 'news_event',
    country: 'Switzerland',
    latitude: 46.2044,
    longitude: 6.1432,
    priority: 8,
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    source: 'World Peace Tribune',
    url: 'https://example.com/geneva-peace',
    category: 'politics'
  },
  {
    _id: 'test_4',
    title: 'Medical Breakthrough in Sydney',
    description: 'Researchers announce promising new treatment for rare diseases.',
    eventType: 'news_event',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    priority: 7,
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    source: 'Medical Journal',
    url: 'https://example.com/sydney-medical',
    category: 'health'
  },
  {
    _id: 'test_5',
    title: 'Cultural Festival Celebrates Unity in Mumbai',
    description: 'Thousands gather to celebrate diversity and promote interfaith dialogue.',
    eventType: 'news_event',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    priority: 5,
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    source: 'Cultural Times',
    url: 'https://example.com/mumbai-festival',
    category: 'culture'
  }
];

async function insertTestData() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('aya');
    const eventsCollection = db.collection('events');
    
    // Clear existing test data
    await eventsCollection.deleteMany({ _id: { $regex: /^test_/ } });
    console.log('Cleared existing test data');
    
    // Insert new test data
    const result = await eventsCollection.insertMany(testEvents);
    console.log(`Inserted ${result.insertedCount} test events`);
    
    // Verify the data
    const count = await eventsCollection.countDocuments();
    console.log(`Total events in database: ${count}`);
    
  } catch (error) {
    console.error('Error inserting test data:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

insertTestData();
