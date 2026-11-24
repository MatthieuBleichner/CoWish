# Agent Guide — CoWish

This file is the entry point for every agent working in this repository.

## Before modifying code

1. Read [`docs/product/product-context.md`](docs/product/product-context.md) to understand the
   product needs and identify unresolved business questions.
2. Read [`docs/technical/architecture.md`](docs/technical/architecture.md) and the guide for the
   relevant area.
3. Check the Git status and preserve the user's existing changes.
4. Do not turn an assumption marked `To be confirmed` into a business rule without validation.

## Working principles

- The code and tests are the source of truth for behavior that is already implemented.
- The product documentation is the source of truth for expected behavior.
- A structural decision, or one that is difficult to reverse, must be recorded in
  [`docs/decisions`](docs/decisions/README.md).
- A functional change must update the relevant tests and documentation.
- Secrets must never be committed. Document new variables in `.env.example` when they are
  introduced.
- Follow strict TypeScript and the conventions enforced by ESLint and Prettier.

## Minimum validation

From the repository root, run the commands relevant to the scope of the change:

```sh
yarn lint
yarn format:check
yarn test
yarn build
```

For a backend-only change, workspace-level commands are acceptable:

```sh
yarn workspace @cowish/backend test
yarn workspace @cowish/backend build
```

## Repository map

```text
apps/backend/          Express API and tests
docs/product/          vision, users, scope, and business rules
docs/technical/        architecture and development practices
docs/decisions/        architecture decisions (ADRs)
packages/              reserved for shared libraries
```

When a subproject becomes sufficiently complex, add a local `AGENTS.md` only if its rules differ
from these rules.
