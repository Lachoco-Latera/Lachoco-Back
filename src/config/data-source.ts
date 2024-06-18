import { DataSource } from "typeorm";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from "./envs";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  dropSchema: true,
  logging: ["error"],
  entities: [],
  subscribers: [],
  migrations: [],
  ssl: true,
  cache: true,
  maxQueryExecutionTime: 1000,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
