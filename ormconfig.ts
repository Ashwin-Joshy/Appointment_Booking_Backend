import * as dotenv from 'dotenv';
dotenv.config();

const databaseConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    'src/entities/*.ts',
  ],
};

export default databaseConfig;
