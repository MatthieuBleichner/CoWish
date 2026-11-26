# 0003 — Use i18next for frontend localization

- Status: accepted
- Date: 2026-11-26
- Decision-makers: project owner

## Context

The CoWish frontend must be available in English and French. Translation needs will grow as the
product gains interactive list, voting, and comment interfaces. The application needs language
fallbacks, React integration, and a clear place for translation resources without introducing a
full routing convention yet.

## Considered options

- maintain a small custom translation context and string dictionaries;
- use i18next with react-i18next;
- adopt a compile-time internationalization framework.

## Decision

Use i18next with react-i18next. Store translations in language-specific TypeScript modules,
detect the browser language, support English and French, and fall back to English. Allow people to
switch languages directly in the interface.

## Consequences

The frontend gains established interpolation, fallback, pluralization, and React binding behavior
for future features. It also gains two runtime dependencies and a translation-key structure that
must be maintained across supported languages. Locale-prefixed URLs and persistence of an explicit
language choice remain undecided until routing or account preferences require them.
