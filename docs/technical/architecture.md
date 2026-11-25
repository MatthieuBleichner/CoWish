# Technical Architecture

## Overview

CoWish is organized as a Yarn monorepo, with applications under `apps/*` and a reserved location
for shared libraries under `packages/*`.

```text
Future client
    │ HTTP / JSON
    ▼
apps/backend
    ├── src/server.ts  server startup and lifecycle
    ├── src/app.ts     Express configuration and dependency wiring
    └── src/modules/products
        ├── product.routes.ts          endpoint declaration
        ├── product.controller.ts      HTTP input and response handling
        ├── product.service.ts         import and refresh behavior
        ├── product-extractor.ts       retailer metadata extraction
        └── file-product-repository.ts JSON prototype persistence
```

There is currently no frontend, database, or authentication. The first external integration is a
deliberately narrow product metadata importer for Ruggable and Teppana. Do not assume technologies
for the remaining areas before a decision is made.

## Current backend

- Target runtime: Node.js, using Node 24 types.
- Language: TypeScript 6, targeting ECMAScript 2022.
- Modules: ESM with `NodeNext` resolution.
- HTTP server: Express 5.
- Exchange format: JSON.
- Port: `PORT`, defaulting to `3000`.

`src/app.ts` builds and exports the application without opening a port. This separation makes the
API testable in memory. `src/server.ts` is the operational entry point: it listens on the port and
manages server shutdown.

## Existing HTTP contract

### `GET /api/health`

- success: HTTP `200`, body `{"status":"ok"}`;
- purpose: verify that the HTTP process responds;
- current limitation: this check does not verify any dependency because none exist yet.

### Generic errors

- unknown route: HTTP `404`, `{"error":"Route not found"}`;
- unhandled error: HTTP `500`, `{"error":"Internal server error"}`.

Public responses must not expose stack traces or secrets.

### Product import prototype

- `POST /api/products/import` with `{"url":"https://..."}` imports a supported URL. Importing an
  already-known normalized URL refreshes it instead of creating a duplicate.
- `GET /api/products` lists imported products and their price observations.
- `POST /api/products/:id/refresh` fetches a product again and reports `priceChanged` and
  `previousPrice`.

Only HTTPS product URLs on Ruggable and Teppana are accepted in this first slice. Known selection
parameters (`size` and `variant`) are retained; tracking parameters are discarded. The extractor
prefers schema.org JSON-LD and falls back to Open Graph metadata. A refresh records a new
observation even when the price is unchanged, because the observation also proves when the price
was last checked.

The prototype store defaults to `data/products.json`. The directory is ignored by Git and writes
replace the file atomically. This is intentionally local, single-process persistence, not a
database choice or a production storage design. The repository interface keeps that temporary
choice outside the import behavior.

## Quality and compilation

The `tsconfig.base.json` file enforces, among other settings:

- `strict`;
- `noUncheckedIndexedAccess`;
- `exactOptionalPropertyTypes`;
- `isolatedModules`.

The backend build compiles `src` to `apps/backend/dist` with source maps. Tests use `node:test` and
run TypeScript directly through `tsx`. ESLint analyzes the repository, and Prettier handles
formatting.

## Architectural direction

Keep the structure simple while the domain remains small. Introduce layers or packages only when
a genuine boundary emerges. A likely backend evolution is:

```text
src/
├── app.ts
├── server.ts
├── modules/<business-capability>/
│   ├── <capability>.routes.ts
│   ├── <capability>.controller.ts
│   └── <capability>.service.ts
└── shared/                 only for genuinely cross-cutting code
```

Within a module, routes only declare endpoints and attach controller methods. Controllers own the
HTTP boundary: they validate request input, call the service, and map known outcomes to HTTP
responses. Services implement use cases without depending on Express. Add supporting files such as
repositories, external adapters, schemas, or types only when the module has that concrete need;
they are not mandatory layers.

Principles to preserve:

- separate server startup from application construction;
- validate all data at HTTP boundaries;
- keep business rules out of Express handlers;
- inject external dependencies to make behavior testable;
- keep retailer page fetching out of HTTP handlers;
- version incompatible API contract changes;
- do not create a shared package for a single use case.

## Undecided topics

These choices require an explicit decision when the need arises:

- frontend framework and architecture;
- production persistence, migrations, and backup strategy;
- authentication, authorization, and session management;
- schema validation and OpenAPI documentation;
- observability (structured logs, metrics, and traces);
- hosting, CI/CD, and environments;
- integration and end-to-end testing strategy.

Record structural choices in [`docs/decisions`](../decisions/README.md).
