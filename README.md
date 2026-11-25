# CoWish

CoWish helps couples and groups of friends make joint decisions by collecting, comparing, and
discussing their favorite options in shared lists. A list can cover any topic—from choosing a rug
or a toy to comparing accommodation on Booking.com and Airbnb.

The repository currently contains the foundation of a TypeScript HTTP API. The product scope and
open questions are documented in
[`docs/product/product-context.md`](docs/product/product-context.md).

## Quick start

Prerequisites: Node.js 24 and Yarn Classic (the repository uses Yarn workspaces).

```sh
yarn install
yarn dev:back
```

By default, the API listens on `http://localhost:3000`. To check it:

```sh
curl http://localhost:3000/api/health
```

The expected response is `{"status":"ok"}`. Use the `PORT` environment variable to change the
port.

## Commands

```sh
yarn dev:back      # run the API in watch mode
yarn build         # build all workspaces
yarn test          # test all workspaces
yarn lint          # run static analysis
yarn format:check  # check formatting
yarn format        # apply automatic formatting
```

The `dev:front` script is already reserved for the future `@cowish/frontend` workspace, which does
not exist yet.

## Documentation

- [Product context](docs/product/product-context.md)
- [Technical architecture](docs/technical/architecture.md)
- [Development guide](docs/technical/development.md)
- [Decision log](docs/decisions/README.md)
- [Agent instructions](AGENTS.md)

## Current state

- Express 5 API using ES modules;
- strict TypeScript;
- `GET /api/health` route;
- file-backed import and refresh of product metadata from HTTPS source URLs;
- selected-variant price observations and price-change detection;
- JSON responses for 404 and 500 errors;
- graceful shutdown on `SIGINT` and `SIGTERM`;
- tests using the native Node.js test runner.
