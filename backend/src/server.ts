
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import { MongoDataSource } from './config/mongo.config';
import { SqlDataSource } from './config/sql.config';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {

    await MongoDataSource.initialize();
    console.log('MongoDB connected');

    await SqlDataSource.initialize();
    console.log('MSSQL connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

startServer();
