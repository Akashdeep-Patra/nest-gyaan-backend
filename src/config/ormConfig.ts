import { ConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as path from 'path';
import { configService } from "./config.service";

const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: configService.getValue('POSTGRES_HOST'),
  port: parseInt(configService.getValue('POSTGRES_PORT')),
  username: configService.getValue('POSTGRES_USER'),
  password: configService.getValue('POSTGRES_PASSWORD'),
  database: configService.getValue('POSTGRES_DATABASE'),

  namingStrategy: new SnakeNamingStrategy(),

  entities: [path.join(__dirname, '../modules/**/entities/*.entity{.ts,.js}')],

  migrationsTableName: 'migrations',
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  migrationsRun: true,
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },

  synchronize: false,
  logging: ['error'],
  ssl: (configService.isProduction() || configService.isHeroku()) ? { rejectUnauthorized: false } : false,
}

export = ormConfig;