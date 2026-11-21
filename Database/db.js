import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config();

// connection string
const uri = process.env.CONNECTION_DB;
if (!uri) {
  throw new Error('Connection string not found!');
}

// create a client 
const client = new MongoClient(uri);
export let db;

// connect and create  the database shopbot
export async function connectDB() {
  try 
  {
    await client.connect();
    db = client.db('shopBot')
    console.log('MongoDB connected successfully!');
  } 
  catch (error)
  {
    console.error('Connection error:', error.message);
    throw error;

  }
}