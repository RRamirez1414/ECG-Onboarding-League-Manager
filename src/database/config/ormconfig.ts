import { DataSource, DataSourceOptions } from 'typeorm';

export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5435),
  username: process.env.DB_USERNAME ?? 'apiuser',
  password: process.env.DB_PASSWORD ?? 'dbuser123',
  database: process.env.DB_NAME ?? 'league_manager',
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
};

const dataSource = new DataSource(ormConfig);
export default dataSource;
