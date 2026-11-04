import { DataSourceOptions } from 'typeorm';

export const buildTypeOrmOptions = (env: NodeJS.ProcessEnv): DataSourceOptions => ({
  type: 'postgres',
  host: env.DB_HOST ?? 'localhost',
  port: Number(env.DB_PORT ?? 5432),
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  // Convención: las entidades del ORM se llaman <nombre>.orm-entity.ts
  entities: [__dirname + '/../../../modules/**/infrastructure/**/*.orm-entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false, // prohibido true fuera de desarrollo local
});