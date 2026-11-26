# CoWish

CoWish helps couples and groups of friends make joint decisions by collecting, comparing, and
discussing their favorite options in shared lists. A list can cover any topic—from choosing a rug
or a toy to comparing accommodation on Booking.com and Airbnb.

The repository contains a React frontend and a TypeScript HTTP API. The product scope and open
questions are documented in
[`docs/product/product-context.md`](docs/product/product-context.md).

## Quick start

Prerequisites: Node.js 24 and Yarn Classic (the repository uses Yarn workspaces).

```sh
yarn install
yarn dev:front
yarn dev:back
```

The frontend runs on `http://localhost:5173` and the API listens on `http://localhost:3000` by
default. Run them in separate terminals. To check the API:

```sh
curl http://localhost:3000/api/health
```

The expected response is `{"status":"ok"}`. Use the `PORT` environment variable to change the
port.

## Commands

```sh
yarn dev:front     # run the React app in development mode
yarn dev:back      # run the API in watch mode
yarn build         # build all workspaces
yarn test          # test all workspaces
yarn lint          # run static analysis
yarn format:check  # check formatting
yarn format        # apply automatic formatting
```

## Documentation

- [Product context](docs/product/product-context.md)
- [Technical architecture](docs/technical/architecture.md)
- [Development guide](docs/technical/development.md)
- [Decision log](docs/decisions/README.md)
- [Agent instructions](AGENTS.md)

## Current state

- Express 5 API using ES modules;
- responsive React 19 introductory page built with Vite;
- strict TypeScript;
- `GET /api/health` route;
- file-backed import and refresh of product metadata from HTTPS source URLs;
- selected-variant price observations and price-change detection;
- JSON responses for 404 and 500 errors;
- graceful shutdown on `SIGINT` and `SIGTERM`;
- tests using the native Node.js test runner.
