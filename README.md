# Notion-App

A full-stack task management app built with React, TypeScript, and Node.js.

## What it does

Organize work into projects, sections, and tasks. Set priorities and deadlines, create subtasks, and track progress. Works on desktop and mobile.

## Features

- User authentication (register/login)
- Projects with color coding and favorites
- Tasks with subtasks
- Sections for organizing tasks
- Priorities and deadlines
- Mobile responsive design
- Type-safe database with Prisma ORM

## Tech Stack

Frontend: React 18, TypeScript, Vite, TailwindCSS, Framer Motion
Backend: Node.js, Express, TypeScript
Database: SQLite (dev) / PostgreSQL (prod)

## Quick Start

Frontend:

```bash
cd client
npm install
npm run dev
```

Backend (in another terminal):

```bash
cd server
npm install
npx prisma db push
npm run dev
```

Frontend runs at http://localhost:5173
Backend at http://localhost:3000

## Folder Structure

Frontend (/src):

- /api - HTTP client functions
- /components - React components
- /context - State management
- /hooks - Custom hooks
- /types - TypeScript interfaces

Backend (/src):

- /controllers - Request handlers
- /routes - API endpoints
- /middleware - Auth verification

Database:

- /prisma/schema.prisma - Database schema

## Status

MVP complete. All core features working. See ROADMAP.md for next steps.
