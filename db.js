
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DATABASE);
    console.log('Connected to MongoDB');
} catch (error) {
    console.log('Error connecting to MongoDB:', error);
}

export default db;
