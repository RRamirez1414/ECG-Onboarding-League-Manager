# League Manager

NestJS API for managing league members, teams, and matches. Uses PostgreSQL, TypeORM migrations, and Swagger for API docs.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) (for PostgreSQL)
- `curl` (optional, for seeding from the terminal)

## First-time setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d postgres
```

Postgres runs on host port **5435** (mapped from container port 5432). Port 5434 is avoided because it is commonly used by other local Docker projects.

### 3. Run migrations

```bash
npm run migration
```

This runs all pending migrations in order (initial schema, then staff/audit/referee changes). Migrations are **append-only**: do not edit files that have already been applied in shared environments.

For a completely fresh database:

```bash
docker compose down -v
docker compose up -d postgres
npm run migration
```

### 4. Start the API

```bash
npm run start
```

The app runs at **http://localhost:3000**.

### 5. Seed sample data

With the app running, populate the database with sample members, teams, and matches:

```bash
curl -X POST http://localhost:3000/seed
```

Expected example response:

```json
{
  "cleared": true,
  "members": 52,
  "teams": 4,
  "matches": 10,
  "freeAgents": 4
}
```

By default, seeding clears existing data first. To append without clearing:

```bash
curl -X POST "http://localhost:3000/seed?clear=false"
```

You can also seed from Swagger at **http://localhost:3000/swagger** → **seed** → `POST /seed`.

## Verify it works

- Swagger UI: http://localhost:3000/swagger
- Example: list free agents

```bash
curl http://localhost:3000/member/free-agent
```

## Run everything with Docker (optional)

To run both Postgres and the app in containers:

```bash
docker compose up --build
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/swagger

Migrations run automatically when the app container starts.

## Database connection (DBeaver / psql)

Use these settings when connecting from your machine:

| Field    | Value            |
|----------|------------------|
| Host     | `localhost`      |
| Port     | `5435`           |
| Database | `league_manager` |
| Username | `apiuser`        |
| Password | `dbuser123`      |

## Useful commands

```bash
# Start Postgres only
docker compose up -d postgres

# Stop containers
docker compose down

# Reset database volume and re-run full migration history
docker compose down -v
docker compose up -d postgres
npm run migration

# Revert last migration
npm run migration:undo

# Run tests
npm run test
```

## Project structure

```
src/
├── database/          # TypeORM config and migrations
├── modules/
│   ├── member/        # Member endpoints
│   ├── person/        # Person endpoints
│   ├── team/          # Team endpoints
│   ├── match/         # Match endpoints
│   └── seed/          # Database seeding endpoint
└── common/enums/      # Shared enums
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
