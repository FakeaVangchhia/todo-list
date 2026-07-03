# Task App — Classroom Edition

A Next.js task manager for teaching **React** and **frontend patterns**. No backend required — tasks persist in the browser via `localStorage`.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| UI | React + CSS |
| Data | `localStorage` in `lib/tasks.js` |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/                 # Pages, layout, styles
components/          # UI components (TaskApp, TaskTable, etc.)
lib/tasks.js         # Task CRUD — reads/writes localStorage
```

## Features

- Create, edit, delete, and complete tasks
- Filter by label and status
- Task stats dashboard
- Responsive UI

## Suggested lesson flow

1. Students fork repo and run `npm install`
2. Walk through `components/TaskApp.jsx` — state, effects, composition
3. Open `lib/tasks.js` — swap `localStorage` for a real API as a stretch goal
4. Challenge: add a new label, due-date sorting, or dark mode

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run dev:clean` | Clear `.next` cache, then start dev |
| `npm run build` | Production build |
| `npm start` | Run production server |

## Note on data persistence

Tasks are stored per browser. Clearing site data or using a different device will not share tasks. For a classroom backend exercise, students can replace `lib/tasks.js` with fetch calls to their own API.
"# todo-list" 
