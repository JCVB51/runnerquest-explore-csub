# RunnerQuest Explore CSUB

RunnerQuest Explore CSUB is a web-based campus exploration project designed to help CSUB students learn about important campus locations, student services, and resources through an interactive game-style experience.

The project includes a frontend game interface and a backend API. The backend provides authentication, campus location data, player progress endpoints, and database support for user accounts.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Overview](#backend-overview)
- [Database Overview](#database-overview)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Docker and MySQL Setup](#docker-and-mysql-setup)
- [Deployment Overview](#deployment-overview)
- [Security Notes](#security-notes)
- [Future Improvements](#future-improvements)
- [Useful Commands](#useful-commands)

---

## Project Overview

RunnerQuest Explore CSUB is intended to act as an informational campus tour. Users can explore different campus locations, view helpful information, and interact with game-related features such as location progress and minigame types.

The backend currently supports:

- User signup with `@csub.edu` email restriction
- User login with JWT authentication
- Password hashing with bcrypt
- Protected user route using JWT
- Campus department/building information
- Basic player progress storage
- MySQL database schema for users and planned game data
- Local MySQL setup through Docker
- Deployment support through DigitalOcean, Apache, and PM2

---

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript
- Phaser.js

### Backend

- Node.js
- Express.js
- MySQL
- mysql2
- bcryptjs
- JSON Web Token
- dotenv
- cors
- nodemon

### Development and Deployment

- Docker
- Docker Compose
- DigitalOcean Droplet
- Apache
- PM2
- Git and GitHub

---

## Project Structure

The backend lives inside the `backend/` directory.

```text
backend/
├── package.json
├── package-lock.json
├── docker-compose.yaml
├── .env.example
├── README.md
└── src/
    ├── server.js
    ├── app.js
    ├── config/
    │   ├── db.js
    │   └── schema_dump.sql
    ├── routes/
    │   ├── health.routes.js
    │   ├── departments.routes.js
    │   └── progress.routes.js
    ├── controllers/
    │   ├── departments.controller.js
    │   └── progress.controller.js
    ├── modules/
    │   └── auth/
    │       ├── auth.routes.js
    │       ├── auth.controller.js
    │       ├── auth.service.js
    │       ├── auth.middleware.js
    │       ├── auth.validation.js
    │       └── auth.constants.js
    └── data/
        ├── departments.json
        └── progress.json
