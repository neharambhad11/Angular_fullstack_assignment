
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';

export const SqlDataSource = new DataSource({
  type: 'mssql',
  host: process.env.SQL_HOST,
  port: Number(process.env.SQL_PORT || 1433),
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,

  entities: [User, Order],

  options: {
    encrypt: false,
    trustServerCertificate: true
  },

  synchronize: false,
  logging: false
});
