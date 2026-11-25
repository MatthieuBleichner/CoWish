# Product Context

## Document status

This document defines the current product direction. Confirmed requirements come from the product
owner's description; unresolved implementation or product choices are marked **To be confirmed**.
They must not be treated as requirements until they are validated.

Last updated: 2026-11-24.

## Summary

CoWish helps couples and groups of friends make joint decisions by collecting, comparing, and
discussing their favorite options in shared lists.

A list represents one decision or topic—for example, choosing a rug, a wooden train, or holiday
accommodation. Its members can add candidate items, capture their price and key characteristics,
then vote and comment to reach a decision together.

## Problem to solve

When several people research a purchase, trip, or activity, their options are often scattered
across messages, browser tabs, screenshots, retailer wishlists, and booking platforms. This makes
it difficult to:

- keep all candidates in one place;
- compare prices and important characteristics consistently;
- understand each person's preferences;
- discuss a specific option without losing context;
- remember why a final choice was made.

CoWish should replace this fragmented process with a shared, topic-focused shortlist.

## Users

| Profile      | Primary need                           | Typical usage                                       | Priority        |
| ------------ | -------------------------------------- | --------------------------------------------------- | --------------- |
| List creator | Start and organize a decision          | Creates a list, adds candidates, and invites others | Primary         |
| List member  | Contribute to a shared decision        | Adds items, compares options, votes, and comments   | Primary         |
| Viewer       | Follow a decision without contributing | Reviews the shortlist and discussion                | To be confirmed |

The initial audience is couples and small groups of friends or family. Larger organizations and
formal procurement workflows are not a current target.

## Primary journey

1. A person needs to make a choice with one or more other people.
2. They create a list named after the topic, such as “Living room rug” or “Summer accommodation.”
3. They invite their partner, friends, or family members to the list.
4. Members add candidate items, usually from external websites such as a retailer, Booking.com,
   or Airbnb.
5. Each item records a name, link, price, and the characteristics that matter for that decision.
6. Members compare candidates, vote, and leave item-specific comments.
7. The group uses this shared information to select an option.

Whether CoWish needs an explicit “decision made” state is **to be confirmed**.

## Scope

### MVP

The MVP should support the complete collaborative shortlisting loop:

- create, rename, and access a topic-based list;
- invite other people to a private shared list;
- add, edit, and remove candidate items;
- associate an item with at least a name, source URL, price, image, and free-form key
  characteristics;
- import an item's name, selected-variant price, currency, and image from a supported source URL;
- refresh an imported item and retain price observations so members can see whether its price has
  changed;
- show all candidates in a format that makes comparison easy;
- allow list members to vote on an item;
- allow list members to comment on an item;
- clearly attribute contributions, votes, and comments to their authors;
- keep the shared list synchronized so every member sees the current state.

The MVP must work across different kinds of decisions rather than being limited to shopping or
travel.

### Out of initial scope

Unless validated as necessary for the MVP, the following are out of initial scope:

- purchasing, booking, payment, or checkout inside CoWish;
- public discovery, social feeds, or influencer features;
- retailer accounts, private APIs, or booking-platform integrations beyond public page metadata;
- automated price refreshes and price-drop notifications;
- automated recommendation or ranking algorithms;
- real-time chat unrelated to a specific item;
- enterprise procurement and approval workflows;
- complex list templates tailored to individual product categories.

## Domain model and vocabulary

| Term           | Definition                                   | Relationships / constraints                         |
| -------------- | -------------------------------------------- | --------------------------------------------------- |
| User           | A person who uses CoWish                     | May create and join multiple lists                  |
| List           | A shared shortlist for one decision or topic | Contains members and candidate items                |
| Member         | A user with access to a list                 | Permissions remain to be defined                    |
| Item           | One candidate option being considered        | Belongs to one list and may have votes and comments |
| Characteristic | A decision-relevant fact about an item       | Its label and value may vary by list or item        |
| Vote           | A member's expressed preference for an item  | Voting model is to be confirmed                     |
| Comment        | A message attached to an item                | Has an author and creation time                     |
| Source URL     | The external page where an item was found    | CoWish does not complete the purchase or booking    |

## Business rules

- A list represents a single topic or decision.
- A list may contain candidates from different external sources.
- An item belongs to exactly one list in the MVP.
- Votes and comments are attached to a specific item and attributed to a member.
- List content is shared: members see the same candidates, votes, and comments.
- Removing a member's content, changing another member's content, and list ownership transfer are
  **to be confirmed**.
- The exact voting model—like/dislike, approval, score, ranking, or another mechanism—is **to be
  confirmed**.

## Success metrics

Initial success should be measured around completed collaborative decisions rather than raw list
creation. Candidate metrics are:

- activation: a list receives at least two items and a contribution from a second member;
- engagement: the share of active lists receiving votes or comments from multiple members;
- outcome: the share of active lists that result in a selected option, if a decision state is
  implemented;
- retention: users returning to create or join another list;
- time to first collaborative contribution;
- guardrails: invitation failure, abandoned empty lists, unauthorized access, and content loss.

Targets and the precise definition of an “active list” are **to be confirmed**.

## Product constraints

- Lists are expected to be private by default because they may expose personal interests, travel
  plans, or spending intentions.
- Source URLs may come from arbitrary retailer and booking websites.
- Prices may use different currencies; conversion behavior is **to be confirmed**.
- Mobile use is important because links are frequently shared from shopping and travel apps;
  supported platforms are **to be confirmed**.
- Language, accessibility baseline, data retention, hosting region, and business model are **to be
  confirmed**.

## Priority open questions

1. How are users authenticated, and how does a creator invite members?
2. Which roles and permissions exist within a list?
3. What voting mechanism best supports a decision without becoming cumbersome?
4. Can the group mark a winning item or close a decision?
5. Are characteristics free-form per item, defined once for the list, or both?
6. How should unavailable items be represented?
7. How much price history should be retained, and how should it be presented?
8. Can one item be reused or copied across lists?
9. Which notifications are required for invitations, new items, votes, and comments?
10. What privacy, deletion, and data export controls are required?
