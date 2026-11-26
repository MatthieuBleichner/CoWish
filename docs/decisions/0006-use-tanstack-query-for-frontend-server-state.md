# 0006 — Use TanStack Query for frontend server state

- Status: accepted
- Date: 2026-11-26
- Decision-makers: project owner

## Context

The product library fetches server data from React and manually manages loading, failure,
cancellation, and retry behavior. More API-backed features will otherwise repeat this lifecycle
logic and may implement inconsistent caching and refresh behavior.

## Considered options

- continue managing requests with React effects and local state;
- build a project-specific server-state abstraction;
- use TanStack Query while retaining the existing runtime-validating API client.

## Decision

Use TanStack Query for asynchronous server state consumed by React. Feature API modules define
query options and query keys next to their request and validation functions. A single query client
is provided at the application root. The shared HTTP client remains responsible for executing
`fetch`, checking HTTP status, and returning untrusted response data for feature-level validation.

## Consequences

Components receive consistent loading, error, cancellation, retry, and caching behavior without
reimplementing request lifecycle state. Query keys become the mechanism for targeted invalidation
after future mutations. TanStack Query is an additional frontend runtime dependency, and tests
that render query consumers must provide an isolated query client.
