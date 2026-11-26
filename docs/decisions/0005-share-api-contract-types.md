# 0005 — Share API contract types between applications

- Status: accepted
- Date: 2026-11-26
- Decision-makers: project owner

## Context

The frontend and backend both describe the product response returned by `GET /api/products`.
Defining `Product`, `PriceObservation`, and `ProductAvailability` independently in each application
creates a risk that the compile-time representations drift apart.

## Considered options

- keep separate frontend and backend definitions;
- import backend types directly into the frontend;
- create a small workspace for types that are part of the cross-application contract.

## Decision

Create a type-only `@cowish/shared` workspace and place the product API contract types there. Both
applications depend on that workspace explicitly. Keep backend-only ports and extracted-product
types in the backend, and keep component props beside their components.

## Consequences

The applications compile against one representation of the product response without coupling the
frontend to backend implementation files. The package is intentionally type-only, so the frontend
must still validate untrusted HTTP responses at runtime. Future shared types belong here only when
they represent a genuine cross-application contract.
