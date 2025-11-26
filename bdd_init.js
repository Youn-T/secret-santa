import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI_CLUSTER;
const DB_NAME = process.env.DB_NAME;
const SECRET_SANTA_COLLECTION = process.env.SECRET_SANTA_COLLECTION;
const USERS_COLLECTION = process.env.USERS_COLLECTION;
async function initDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    // Drop and recreate collections (optional)
    await db.dropDatabase();

    const placeholderUserId = Date.now().toString();
    // Users collection
    await db.createCollection(USERS_COLLECTION);
    await db.collection(USERS_COLLECTION).insertMany([
      {
        id: placeholderUserId,
        username: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hashedpassword123', 
        createdAt: new Date(),
        avatar: 'https://placehold.co/72x72.png?text=Alice',
      }
    ]);

    await db.createCollection(SECRET_SANTA_COLLECTION);
    await db.collection(SECRET_SANTA_COLLECTION).insertMany([
      {
        id: Date.now().toString(),
        name: 'Secret Santa Event 2024',
        budget: 20,
        date: new Date('2024-12-24'),
        adminSeesDraws: false,
        adminParticipates: true,
        createdAt: new Date(),
        adminId: placeholderUserId,
        members: [ placeholderUserId ],
        draw: []
      }
    ]);

    console.log('✅ Base de données initialisée avec succès !');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation :', err);
  } finally {
    await client.close();
  }
}

initDatabase();
