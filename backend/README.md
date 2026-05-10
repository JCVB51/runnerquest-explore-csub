# RunnerQuest: Explore CSUB

A 2D top-down campus exploration game inspired by California State University, Bakersfield (CSUB). Players explore key campus locations, interact with NPCs, complete short minigames, and unlock progress badges while learning useful campus information.

## Team

- **Juan Villacorta** — Backend / Database Lead 
- **Douglas Cerrato** — Frontend Lead
- **Joseph Hernandez** — Design / Content / QA Lead

## Project Overview

RunnerQuest: Explore CSUB is a web-based educational game designed to help users explore a simplified CSUB campus through interactive gameplay. Players can visit major campus buildings, talk to NPCs, complete small minigames, and track their progress.

## Core Features

- 2D top-down campus exploration
- Interactable campus locations
- NPC dialogue and campus information
- Multiple minigames
- Player progress tracking
- Badge or stamp collection
- Leaderboard or stats page
- Persistent save data

## Planned Campus Locations

- Library
- Student Union
- Science Building
- Advising / Student Services
- Rec Center
- Dining / Runner Café

## Tech Stack

### Frontend / Game
- **Phaser** for 2D gameplay
- **JavaScript** / HTML / CSS

### Map Creation
- **Tiled** for campus map and collision layers

### Backend
- **Node.js**
- **Express**

### Database
- **MySQL 8** (run locally via Docker)

### Version Control & Planning
- **GitHub**
- **GitHub Projects**

## 👥 Team

### Juan Villacorta — Backend Lead
- Express server
- API routes & controllers
- Database schema
- Progress & leaderboard system

### Douglas — Frontend / Game Lead
- Phaser game development
- Player movement & mechanics
- Scene management
- Frontend ↔ backend integration

### Joseph — Design / Content Lead
- Campus map (Tiled)
- UI/UX design
- Visual assets
- Minigame content

## Proposed Project Structure

```bash
runnerquest-explore-csub/
│
├── client/
│   ├── assets/
│   ├── scenes/
│   ├── models/
│   ├── ui/
│   └── main.js
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── app.js
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── style-guide.md
│   └── user-stories.md
│
├── .gitignore
├── LICENSE
├── README.md
└── package.json
```

---

## Backend Setup (Beginner Friendly)

This section walks you through running the backend on your own machine. You should be able to copy/paste each block in order.

### 1. Prerequisites

- **Node.js 18+** and **npm** — check with `node -v` and `npm -v`.
- **Docker** with Docker Compose — check with `docker -v` and `docker compose version`. Docker is used to run MySQL so you don't need to install MySQL by hand.
- **Git** — to clone the repo.

### 2. Clone the repo and install Node dependencies

```bash
git clone https://github.com/JCVB51/runnerquest-explore-csub.git
cd runnerquest-explore-csub
npm install
```

### 3. Create your local `.env` file

The repo ships with `.env.example`. Copy it and edit `JWT_SECRET`:

```bash
cp .env.example .env
```

Required environment variables (already present in `.env.example`):

| Variable      | Default value (dev)                     | What it's for                                  |
|---------------|-----------------------------------------|------------------------------------------------|
| `PORT`        | `3001`                                  | Port the Express server listens on             |
| `DB_HOST`     | `localhost`                             | MySQL host                                     |
| `DB_PORT`     | `3307`                                  | MySQL host port (Docker maps 3307 → 3306)      |
| `DB_USER`     | `runnerexplorer`                        | MySQL user                                     |
| `DB_PASSWORD` | `runnerexplorer`                        | MySQL password                                 |
| `DB_NAME`     | `runner_explorer`                       | Database name                                  |
| `JWT_SECRET`  | `change_this_to_a_long_random_secret`   | Secret used to sign login JWTs — change this!  |
| `NODE_ENV`    | `development`                           | When `development`, signup also returns the verification token in the response so you can test without real email |

Generate a strong `JWT_SECRET` quickly:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 4. Start MySQL with Docker

```bash
docker compose up -d
```

This launches MySQL 8 in a container named `mysql_db` on host port `3307`. The first time you start it, Docker automatically runs `src/config/schema_dump.sql` to create the `users`, `player`, `progress`, and `score` tables.

Verify the tables exist:

```bash
docker exec -it mysql_db mysql -urunnerexplorer -prunnerexplorer runner_explorer \
  -e "SHOW TABLES;"
```

> **Note:** the SQL file only runs on a fresh MySQL volume. If your container already exists from before this change, run `docker compose down -v && docker compose up -d` to recreate it (this wipes existing data), or apply the SQL manually:
>
> ```bash
> docker exec -i mysql_db mysql -urunnerexplorer -prunnerexplorer runner_explorer < src/config/schema_dump.sql
> ```

### 5. Start the backend in dev mode

```bash
npm run dev
```

You should see `Server is running on http://localhost:3001`. Quick health check:

```bash
curl http://localhost:3001/api/health
# {"status":"ok"}
```

---

## API Endpoints

All endpoints live under `http://localhost:3001/api`.

| Method | Path                          | Storage    | Auth required | Purpose                                |
|--------|-------------------------------|------------|---------------|----------------------------------------|
| GET    | `/api/health`                 | none       | no            | Health check                           |
| POST   | `/api/auth/signup`            | **MySQL**  | no            | Create account (`@csub.edu` only)      |
| POST   | `/api/auth/verify-email`      | **MySQL**  | no            | Verify email with the signup token     |
| POST   | `/api/auth/login`             | **MySQL**  | no            | Get a JWT after verification           |
| GET    | `/api/auth/me`                | none       | **yes (JWT)** | Return the logged-in user              |
| GET    | `/api/departments`            | JSON file  | no            | List all campus buildings              |
| GET    | `/api/departments/:id`        | JSON file  | no            | Get one building by id                 |
| GET    | `/api/progress/:playerId`     | JSON file  | no            | List a player's progress entries       |
| POST   | `/api/progress`               | JSON file  | no            | Save a new progress entry              |

> **Where the data lives.** Authentication (signup, verification, login, JWT) uses **MySQL** — specifically the `users` table. Departments and progress are currently served from **JSON files** in `src/data/` (`departments.json` and `progress.json`). The MySQL tables `player`, `progress`, and `score` from `schema_dump.sql` exist but are not yet wired to the API; that's a planned migration.

---

## Curl Examples

The flow is: signup → verify-email → login → use the JWT for `/me`. You only need to do steps 1–3 once per test account.

### 1. Signup

Only `@csub.edu` emails are allowed. Password must be at least 8 characters.

```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@csub.edu","password":"password123"}'
```

In `development` mode the response includes `devVerification.token`. Copy that value for the next step.

### 2. Verify email

Replace `<TOKEN>` with the token returned by signup.

```bash
curl -X POST http://localhost:3001/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token":"<TOKEN>"}'
```

### 3. Login

Returns a JWT in the `token` field, valid for 1 hour.

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@csub.edu","password":"password123"}'
```

### 4. Get the current user (`/me`)

Replace `<JWT>` with the token from login. This endpoint is protected by JWT middleware.

```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <JWT>"
```

### 5. Departments

```bash
curl http://localhost:3001/api/departments
curl http://localhost:3001/api/departments/library
```

### 6. Progress

```bash
curl http://localhost:3001/api/progress/testplayer

curl -X POST http://localhost:3001/api/progress \
  -H "Content-Type: application/json" \
  -d '{"playerId":"testplayer","locationId":"student_union","completed":true,"badgeUnlocked":false,"score":5}'
```

---

## Troubleshooting

- **`ECONNREFUSED 127.0.0.1:3307`** — MySQL isn't running. Run `docker compose up -d` and wait ~10 seconds.
- **`Table 'runner_explorer.users' doesn't exist`** — your MySQL volume is older than the current `schema_dump.sql`. Either run `docker compose down -v && docker compose up -d` (wipes data) or apply the SQL manually as shown in step 4.
- **Login returns "Email is not verified yet."** — call `/api/auth/verify-email` first with the token from signup.
- **`/api/auth/me` returns 401** — make sure the header is exactly `Authorization: Bearer <JWT>` and the token hasn't expired (1 hour TTL).
