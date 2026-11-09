
import { DataSource } from 'typeorm';
import { Product } from '../schemas/product.schema';

export const MongoDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URL,
  database: process.env.MONGO_DATABASE,
  entities: [Product],
  synchronize: true,
  logging: false
});
