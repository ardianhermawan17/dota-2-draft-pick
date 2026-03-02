# AI_LOG.md

## Fullstack Engineer - Take Home Assessment 3A

## AI Tool Usage Summary

- AI tools used:
  - ChatGPT (Free Version)
  - Qwen (Free Version)
  - Local AI <5B model> (Free / local)
- Primary usage style:
  - Used for context enrichment (suggestions, reasoning, calculations, risk checks)
  - Not used for initial scaffolding or folder architecture
  - UI/Logic slicing assistance started after ~70% of app structure was already built manually
  - Testing assistance used heavily (~80%) to simulate end-user perspective
  - Prompts were typically given from a rough concept in research mode
- Why this approach:
  - To minimize AI context loss during implementation
  - Practical target: better to risk ~30% context loss than ~70%

## Iteration Summary

- Typical iteration count: 1-2
- Maximum iteration count reached: 3
- Main reason for extra iteration: polishing UI quality and interaction details

## Prompt Records

### Record 1 - Product reasoning and scope shaping

- First prompt:
  - "I have a rough concept for a Dota 2 draft simulator. Help me define feature priorities, risks, and reasoning for static draft, live draft, and history draft."
- Iterations to accepted result:
  - 2
- Final prompt or accepted output:
  - Accepted output: a prioritized scope list with route-level goals (`static_draft`, `live_draft`, `history_draft`) and MVP vs non-MVP boundaries.
- Short usage note:
  - Used for context enrichment and planning, not code generation.

### Record 2 - Wilson Score and meta hero calculation logic

- First prompt:
  - "Explain the Wilson Score in simple engineering terms and how to rank heroes using win rate + sample size for the last 6 months."
- Iterations to accepted result:
  - 2
- Final prompt or accepted output:
  - Accepted output: Wilson Score explanation + practical ranking formula guidance for `meta_heroes` prioritization.
- Short usage note:
  - Used for calculation reasoning and decision confidence, then implemented manually.

### Record 3 - UI/Logic separation pattern after architecture was ready

- First prompt:
  - "My folder architecture is mostly ready. Suggest a clean pattern to separate UI component and hook logic per feature module."
- Iterations to accepted result:
  - 3
- Final prompt or accepted output:
  - Accepted output: component split pattern (`index`, UI file, `use-logic` hook) applied to feature modules.
- Short usage note:
  - Used for refactoring direction and consistency after manual architecture setup.

### Record 4 - User-centric test scenario generation

- First prompt:
  - "Generate realistic user test scenarios for live drafting with reserve timer and auto-random pick fallback when time is exhausted."
- Iterations to accepted result:
  - 2
- Final prompt or accepted output:
  - Accepted output: end-user test cases covering timer depletion, random fallback, invalid picks, and edge draft states.
- Short usage note:
  - Used for test design and QA perspective (represent user behavior, not only developer assumptions).

## Additional Notes

- AI was used as a thinking partner for reasoning-heavy tasks.
- Core app scaffolding, folder architecture, and most implementation decisions were done manually.
- This workflow improved speed while keeping architecture control and reducing prompt drift.
