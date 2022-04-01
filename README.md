## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript Backend application for Gyaan AI project.

## Prerequisites

- Make sure you have node vers- Create `.env` file in root directory with contents similar to `.env.example` just replace the values accordnig to enviornment.

## Installation

```bash
$ npm install
```

## DB Migration

make sure to run the generate migration command whenever DB changes are done, also try to have separate migration per entity.

- For DB Sync (developers)
  `npm run typeorm schema:sync`

- For generating the migration
  `npm run migration:generate <migration_name>`

- For running the existing migrations
  `npm run migration:run`

- For reverting the last migration
  `npm run migration:revert`

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment setup

```
This project use the `dotenv` library for using the enviroment specific configuration variables in the application.

To setup the enviroment:
1. Copy the env.example file and rename it as .env
2. Update all the enviroment variables mentioned with enviroment specific values.
```

### Update env.example file

```
Whenever you add a new enviroment variable, make sure you add that variable with empty masked value in the env.example file so the other developers can update the same at their end and it will help in deployments as well
```

# Database

GyaanAI uses Postress with [TypeORM](https://github.com/nestjs/nest)
