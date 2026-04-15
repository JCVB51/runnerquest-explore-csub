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
- **Supabase Postgres** or **PostgreSQL / SQLite**

### Version Control & Planning
- **GitHub**
- **GitHub Projects**

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
