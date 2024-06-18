"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const envs_1 = require("./envs");
const host = envs_1.DB_HOST;
const port = envs_1.DB_PORT;
const username = envs_1.DB_USERNAME;
const password = envs_1.DB_PASSWORD;
const database = envs_1.DB_DATABASE;
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
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
