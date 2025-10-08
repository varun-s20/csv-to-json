# Csv-To-Json

An Express project that reads a CSV file, parses records, inserts them into a PostgreSQL database, and returns the processed JSON response.

## Table of contents

- Requirements
- Installation
- Environment variables
- Database schema
- How it works
- Running the project
- API endpoints
- Example request
- Troubleshooting
- Notes

## Requirements

- Node.js (14+ recommended) and npm
- PostgreSQL database

## Installation

1. Clone or download the repository and change into the project directory:

`cd path/to/Csv-To-Json`

2. Install dependencies:

   `npm install`

3. Create a PostgreSQL database and a `users` table (see Database schema below).

4. Add a `.env` file at the project root with the required environment variables (see below).

## Environment variables

Create a `.env` file in the project root with the following values:

```
PORT=3000
PGUSER=your_pg_user
PGHOST=localhost
PGDATABASE=your_database_name
PGPASSWORD=your_password
PGPORT=5432
```

- `PORT` (optional) — port the Express server listens on (default: 3000).
- `PG*` variables — used by the `pg` Pool to connect to PostgreSQL.

## Database schema

The project expects a `users` table in the `public` schema with at least these columns:

```sql
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  address JSONB,
  additional_info JSONB,
  gender TEXT
);
```

Notes:

- `address` and `additional_info` are stored as JSONB to preserve structured data from the CSV.

## How it works

- The server entry point is `server.js`. It loads `env.js` (dotenv), initializes Express and connects to the database using `src/config/db.js`.
- Routes are defined in `routes.js` and the CSV upload/processing endpoint is in `src/routers/user.router.js` which delegates to `src/controllers/user.controller.js`.
- The CSV parsing logic is in `src/utils/csvParse.js` (used by `src/middleware/dataUploader.js`). That middleware reads the CSV, transforms each record into the expected shape, inserts into the `users` table, and returns a list of uploaded records and any errors encountered. It also prints an age-group distribution to the console.

## Running the project

1. Ensure your PostgreSQL server is running and the database/schema/table exist.
2. Ensure your `.env` file is present and correct.
3. Install dependencies (if not already done):

   `npm install`

4. Start the server:

   `node server.js`

   OR

   `npm start`

You should see output similar to:

```
Connected to the database succesfully
Server is listening on port 3000
```

If you prefer using `nodemon` for development, install it globally or as a dev dependency and run `nodemon server.js`.

## API endpoints

- GET /api/

  - Description: Health/welcome endpoint
  - Response: JSON message

- POST /api/user/upload-data
  - Description: Parses the CSV file (from the repo or configured source), inserts rows into the database, and returns uploaded JSON and any errors.
  - Request body: This project currently reads CSV from a local file via `src/utils/csvParse.js`. Check that file if you want to adapt the endpoint to accept uploads.

Response examples:

- Success (200): { data: [...], message: 'Data successfully uploaded.', status: 200, success: true }
- Partial/validation errors (400): { message: 'Data upload completed with errors.', errors: [...], uploadedData: [...], status: 400, success: true }
- Server error (500): { message: '...', status: 500, success: false }

## Example request

Use curl or Postman to call the upload endpoint. Because the current implementation does not accept file streams via the endpoint, you can simply call the endpoint to trigger CSV processing as implemented by the project:

```
curl -X POST http://localhost:3000/api/user/upload-data
```

Replace the host/port if you changed the `PORT` env var.

### Using Postman

To call the upload endpoint from Postman:

1. Open Postman and create a new request.
2. Change the method to `POST`.
3. Set the URL to `http://localhost:3000/api/user/upload-data` (or replace `localhost:3000` with your host/port).
4. You don't need to attach a file for the current implementation, therefore keep the body empty (the server reads the CSV from disk via `src/utils/csvParse.js`).
5. Click `Send`. You should get a JSON response with uploaded data or errors.

## Troubleshooting

- "Error connecting to the database": verify your `.env` values and that PostgreSQL is running and reachable from your machine.
- If the server starts but the CSV processing fails: check `src/utils/csvParse.js` to ensure it points to the correct CSV path and that the CSV is valid.
- If you see JSON/parse errors, inspect the CSV header names — this project expects nested header names like `name.firstName`, `address.line1`, etc. Adjust headers or parsing logic accordingly.
