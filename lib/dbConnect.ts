import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI_CLUSTER;
const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI_CLUSTER environment variable');
}

const client = new MongoClient(MONGODB_URI);
const clientPromise = client.connect();

export async function dbClient() {
  return clientPromise;
}

export async function dbConnect() {
  const connectedClient = await clientPromise;
  const db = connectedClient.db(DB_NAME);
  return { db };
}