import { DataSource } from 'typeorm';
declare const _default: (() => {
    type: string;
    database: string;
    host: string;
    port: number;
    username: string;
    password: string;
    autoLoadEntities: boolean;
    synchronize: boolean;
    logging: string[];
    dropSchema: boolean;
    entities: string[];
    migrations: string[];
    ssl: boolean;
    cache: boolean;
    maxQueryExecutionTime: number;
    extra: {
        ssl: {
            rejectUnauthorized: boolean;
        };
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: string;
    database: string;
    host: string;
    port: number;
    username: string;
    password: string;
    autoLoadEntities: boolean;
    synchronize: boolean;
    logging: string[];
    dropSchema: boolean;
    entities: string[];
    migrations: string[];
    ssl: boolean;
    cache: boolean;
    maxQueryExecutionTime: number;
    extra: {
        ssl: {
            rejectUnauthorized: boolean;
        };
    };
}>;
export default _default;
export declare const connectionSource: DataSource;
