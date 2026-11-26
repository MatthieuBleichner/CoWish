# 0002 — Use React and Vite for the frontend

- Status: accepted
- Date: 2026-11-26
- Decision-makers: project owner

## Context

CoWish needs its first browser interface. The repository already uses TypeScript and Yarn
workspaces, but the frontend framework and build tooling were intentionally left undecided. The
initial interface is small, while future collaborative lists will require interactive UI and API
integration.

## Considered options

- build a static HTML and CSS page without a framework;
- use React with Vite;
- use a full-stack React framework with server-side rendering and routing conventions.

## Decision

Create an `@cowish/frontend` workspace using React, strict TypeScript, and Vite. Keep the frontend
as a client-rendered application until requirements demonstrate a need for server rendering or a
full-stack framework. Use React components for the interface and Vite for local development and
production builds.

## Consequences

The frontend shares the repository's TypeScript and quality tooling and has a fast local
development server. React and Vite become long-lived dependencies. Client-side routing, data
fetching conventions, and browser end-to-end testing remain open until the product needs them.
