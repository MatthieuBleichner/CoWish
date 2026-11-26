# 0004 — Use Material UI for frontend components

- Status: accepted
- Date: 2026-11-26
- Decision-makers: project owner

## Context

Future CoWish screens will need accessible forms, dialogs, navigation, feedback, and interactive
list controls. Building and maintaining all of these primitives locally would slow product work.
The existing introductory page already has a distinct visual identity implemented with plain CSS,
and the frontend runs React 19.2.

## Considered options

- continue building every component with React and plain CSS;
- use Material UI with a shared branded theme;
- use Mantine;
- assemble lower-level primitives with Radix UI or shadcn/ui.

## Decision

Use Material UI and its default Emotion styling engine for reusable interactive components. Define
CoWish colors, typography, shape, and component defaults in a shared theme at the application root.
Keep plain CSS for bespoke page compositions when it provides a clearer or more distinctive result;
adopting Material UI does not require rewriting the existing introductory page.

## Consequences

The frontend gains a broad set of maintained, accessible components and a consistent theming
foundation. Material UI and Emotion become long-lived runtime dependencies, and major-version
upgrades will require deliberate maintenance. Contributors must avoid mixing one-off MUI styling
with global CSS without a clear ownership boundary. MUI X remains outside the dependency set until
a concrete use case requires it.
