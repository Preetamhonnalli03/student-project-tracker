# Student Project Tracker

A hands-on web development workshop project for tracking engineering project ideas. The app supports creating, viewing, editing and deleting projects, with data stored locally in SQLite.

## Requirements

- Node.js 22.18 or later, but below version 23
- npm
- Git
- Visual Studio Code

## Run locally

Open a PowerShell terminal in the project root and run:

```powershell
npm.cmd ci
npm.cmd start
```

Open the app at [http://localhost:3000](http://localhost:3000).

Keep the server terminal running while using the app. To stop the server, press `Ctrl+C`.

## How it works

The browser uses HTML, CSS and JavaScript to display the form and project list. Frontend JavaScript sends HTTP requests to the Express API. The server validates requests and communicates with SQLite. The response returns to the browser, which updates the visible project list.

**Request journey:**

Browser → HTTP request → Express API → SQLite database → API response → updated browser interface.

## Main files

- `public/index.html` — page structure and form.
- `public/style.css` — appearance and responsive layout.
- `public/script.js` — form handling, API requests, rendering and feedback.
- `server.js` — starts the local server.
- `app.js` — API routes, validation and HTTP responses.
- `database.js` — SQLite operations and database setup.
- `data/projects.db` — local SQLite database file.
- `test/crud.test.js` — automated API test.

## API endpoints

- `GET /api/health` — checks server health.
- `GET /api/projects` — retrieves projects.
- `POST /api/projects` — creates a project.
- `PUT /api/projects/:id` — updates a project.
- `DELETE /api/projects/:id` — deletes a project.

## Verification

### Automated test

Command: `npm.cmd test`

**Recorded result:** PASS — 1 test, 0 failures.

The test reported coverage of CRUD operations, validation, persistence, API errors and the static frontend.

### Browser acceptance tests

Record the actual result of each test before the final push:

- Create two projects: Not yet verified.
- Edit a project and confirm its ID remains unchanged: Not yet verified.
- Cancel deletion and confirm deletion: Not yet verified.
- Persistence after refresh and server restart: Not yet verified.
- Blank and whitespace-only input validation: Not yet verified.
- Stopped-server error and recovery: Not yet verified.
- Keyboard focus and 390px-wide layout: Not yet verified.

## Workshop limitations

This is a local teaching application, not a production-ready service. It has no login or per-user permissions. People using the same running server share the same project collection.

The `data/` and `node_modules/` directories should be excluded from Git. Source code is shared through GitHub, while each learner maintains their own local database.

Cloud hosting requires separate server and database configuration. This README does not claim that the app is deployed online.  