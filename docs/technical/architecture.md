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
    └── src/app.ts     Express configuration and routes
```

There is currently no frontend, database, authentication, or external integration. Do not assume
their technologies before a decision is made.

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
│   ├── routes.ts
│   ├── service.ts
│   └── types.ts
└── shared/                 only for genuinely cross-cutting code
```

Principles to preserve:

- separate server startup from application construction;
- validate all data at HTTP boundaries;
- keep business rules out of Express handlers;
- inject external dependencies to make behavior testable;
- version incompatible API contract changes;
- do not create a shared package for a single use case.

## Undecided topics

These choices require an explicit decision when the need arises:

- frontend framework and architecture;
- persistence, migrations, and backup strategy;
- authentication, authorization, and session management;
- schema validation and OpenAPI documentation;
- observability (structured logs, metrics, and traces);
- hosting, CI/CD, and environments;
- integration and end-to-end testing strategy.

Record structural choices in [`docs/decisions`](../decisions/README.md).
