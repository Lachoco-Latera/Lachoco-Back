import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env' });

const config = {
  type: 'postgres',
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: true,
  synchronize: true,
<<<<<<< HEAD
  // logging: false, //['query', 'error'],
=======
  logging: ['query', 'error'], // este cuando se sube a git
  //logging: false, // esto es solo en forma local

>>>>>>> 22820c805c84e0eac62b0be1e9b99a059b17e49d
  dropSchema: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  ssl: false,
  cache: true,
  maxQueryExecutionTime: 1000,
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
};

export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
