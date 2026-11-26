# 0001 — Use GitHub Actions for continuous integration

- Status: accepted
- Date: 2026-11-26
- Decision-makers: project owner

## Context

CoWish has repository-level commands for formatting, linting, testing, and building, but no
automated check currently runs them before changes are merged. The repository is hosted on GitHub
and uses a Yarn Classic lockfile.

## Considered options

- run checks manually only;
- use GitHub Actions;
- use an external continuous integration service.

## Decision

Use GitHub Actions with Node.js 24 and Yarn Classic. Run the repository-level formatting, linting,
test, build/type-check, and production dependency audit commands on pull requests, pushes to
`main`, and manual dispatches.

## Consequences

Changes receive consistent automated validation in a clean Linux environment. The workflow adds
some GitHub-specific configuration and depends on registry availability for dependency installation
and auditing. Deployment remains outside the scope of this decision.
