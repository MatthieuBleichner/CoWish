# Architecture Decision Log

This directory preserves important technical decisions and their context. Its purpose is to make
it possible to understand later why a choice was made, including when that choice is superseded.

## When to create an ADR

Create an Architecture Decision Record when a choice:

- affects several parts of the system;
- commits the project to a long-lived dependency or infrastructure component;
- involves significant trade-offs;
- is costly to reverse;
- supersedes a previous decision.

Choices already visible in the code but not documented (Yarn workspaces, Express, ESM, and strict
TypeScript) describe the current foundation. A retrospective ADR is useful only if their rationale
needs to be explained or if they are being reconsidered.

## Convention

Name files `NNNN-short-title.md`, for example `0001-choose-persistence.md`.

Template:

```md
# NNNN — Decision title

- Status: proposed | accepted | superseded | rejected
- Date: YYYY-MM-DD
- Decision-makers: names or roles

## Context

What problem requires a decision? Which constraints are known?

## Considered options

Which realistic solutions were compared?

## Decision

Which option was selected, and why?

## Consequences

Which benefits, costs, risks, and follow-up tasks result from this decision?
```

## Index

- [0001 — Use GitHub Actions for continuous integration](0001-use-github-actions-for-ci.md)
