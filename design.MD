# Dota 2 Draft Pick System - Design Document

## 1. Project Overview

A real-time **Dota 2 Draft Pick Simulation Platform** that enables users to experience competitive draft scenarios with live mechanics, historical analysis, and intelligent hero recommendations based on meta data.

### Core Goals

- Provide realistic draft experience with live time simulation
- Enable strategic hero analysis and counter-picking
- Maintain historical draft records for user review
- Offer real-time hero performance insights from meta data

---

## 2. Planned Pages/Screens and Routing Structure

### Route Architecture (3 Primary Routes)

| Route            | Purpose                                             | Flow                                                                                           |
| ---------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `/static_draft`  | **Static Draft** - No time pressure, manual pacing  | Select template → Select team side → Draft (unlimited time per pick)                           |
| `/live_draft`    | **Live Draft** - Competitive simulation with timers | Coin flip → Select template → Select team side → Timed drafting (120s reserve, 30s per action) |
| `/history_draft` | **History Manager** - Review and manage past drafts | List view with filters → View draft details → Export/share options                             |

### Page Hierarchy

```
Landing / Dashboard
├── /static_draft
│   ├── Setup Screen (template selection, team selection)
│   ├── Draft Board (grid view, hero pool, selections)
│   └── Summary Screen (final picks/bans)
├── /live_draft
│   ├── Coin Flip Screen
│   ├── Setup Screen (template selection, team selection)
│   ├── Live Board (timers, animations, live picks)
│   └── Summary Screen + Replay
└── /history_draft
    ├── History List (pagination, filters)
    └── Draft Detail View (replay, stats, export)
```

---

## 3. Feature Specifications

### 3.1 Draft Template Rules

**Database Schema:** `template_draft_rules`

```
Configuration:
- max_order: 24 (total picks + bans in sequence)
- pick: 10 (total picks per team × 2 teams)
- ban: 12 (total bans per team × 2 teams)
- Customizable per draft session
```

**Why Configurable:** Different game versions and tournament formats vary in draft conventions.

### 3.2 Impacted Hero Feature

**Data Source:** Query `winning_heroes.per_duration`

**Purpose:** Show heroes that are currently strong and trending upward in the meta

**Duration Tiers:**

- Early (0-15 min)
- Mid (15-35 min)
- Late (35+ min)

**Use Case:** Users see which heroes are most impactful at different game stages during draft.

### 3.3 Meta Heroes Feature

**Data Source:** 6-month historical win rate data with **Wilson Score Confidence Interval**

**Why Wilson Score:**

- Accounts for small sample size bias
- More statistically sound than raw win rate (e.g., 10/10 hero is not as reliable as 500/600)
- Provides confidence bounds for recommendation ranking

**Calculation:**
$$\text{Wilson Score} = \frac{p + \frac{z^2}{2n} \pm z\sqrt{\frac{p(1-p)}{n} + \frac{z^2}{4n^2}}}{1 + \frac{z^2}{n}}$$

Where:

- $p$ = win rate
- $n$ = number of games
- $z$ = 1.96 (95% confidence)

**Use Case:** Displays tier-ranked meta heroes to guide draft decisions.

### 3.4 Counter/Strong Hero Feature

**Data Source:** Query `performance_of_heroes` (hero matchup data)

**Coverage:**

- Counters against picked enemy heroes
- Strong picks into enemy composition
- Win rate vs specific opponents

**Use Case:** Real-time hero recommendations during draft based on enemy selections.

---

## 4. Frontend Architecture

### 4.1 Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** Shadcn
- **State Management:** Redux
- **Form Handling:** React Hook Form (with Zod validation)
- **Immutability:** Immer
- **Animation:** Framer Motion

### 4.2 Folder Structure

```
src/
├── app/                           # Next.js routes & layouts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── static_draft/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── live_draft/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── history_draft/
│       ├── page.tsx
│       └── layout.tsx
│
├── features/                      # Feature-specific modules (domain logic)
│   ├── static-draft/
│   │   ├── components/
│   │   │   ├── setup-screen/
│   │   │   │   ├── index.tsx          # Wrapper
│   │   │   │   ├── setup-screen.tsx   # UI
│   │   │   │   └── use-setup.ts       # Logic
│   │   │   ├── draft-board/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── draft-board.tsx
│   │   │   │   └── use-draft-board.ts
│   │   │   └── summary-screen/
│   │   ├── hooks/
│   │   │   ├── use-static-draft.ts
│   │   │   └── use-hero-filter.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── slices/
│   │   │   └── static-draft.slice.ts  # Redux slice
│   │   └── api/
│   │       └── static-draft.api.ts
│   │
│   ├── live-draft/
│   │   ├── components/
│   │   │   ├── coin-flip/
│   │   │   ├── live-board/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── live-board.tsx (timer logic + animations)
│   │   │   │   └── use-live-board.ts
│   │   │   └── timer-display/
│   │   ├── hooks/
│   │   │   ├── use-live-draft.ts
│   │   │   ├── use-timer.ts           # 120s reserve + 30s per action
│   │   │   └── use-random-pick.ts     # Fallback when time runs out
│   │   ├── slices/
│   │   │   └── live-draft.slice.ts
│   │   └── types/
│   │
│   ├── history-draft/
│   │   ├── components/
│   │   │   ├── draft-list/
│   │   │   ├── draft-detail/
│   │   │   └── draft-replay/
│   │   ├── hooks/
│   │   │   └── use-history-draft.ts
│   │   ├── slices/
│   │   │   └── history-draft.slice.ts
│   │   └── api/
│   │
│   ├── meta-heroes/
│   │   ├── components/
│   │   │   ├── meta-tier/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── meta-tier.tsx
│   │   │   │   └── use-meta-tier.ts
│   │   │   └── hero-card/
│   │   ├── hooks/
│   │   │   └── use-meta-heroes.ts      # Wilson Score ranking
│   │   ├── slices/
│   │   │   └── meta.slice.ts
│   │   └── api/
│   │       └── meta.api.ts
│   │
│   ├── impacted-heroes/
│   │   ├── hooks/
│   │   │   └── use-impacted-heroes.ts  # per_duration filtering
│   │   ├── slices/
│   │   │   └── impacted.slice.ts
│   │   └── api/
│   │
│   ├── counter-heroes/
│   │   ├── hooks/
│   │   │   └── use-counter-heroes.ts   # Matchup calculations
│   │   ├── slices/
│   │   │   └── counter.slice.ts
│   │   └── api/
│   │
│   └── entities/                   # Normalized data from DB
│       ├── heroes/
│       │   ├── types/
│       │   │   └── hero.ts
│       │   ├── hooks/
│       │   │   └── use-heroes.ts
│       │   ├── normalization/
│       │   │   └── hero.normalizer.ts
│       │   └── slices/
│       │       └── hero.slice.ts
│       └── teams/
│           ├── types/
│           └── slices/
│
├── shared/                        # Shared utilities & config
│   ├── config/
│   │   ├── constants.ts            # Draft rules defaults, API endpoints
│   │   ├── env.ts                  # Environment variables
│   │   └── colors.ts               # Dota 2 team colors, hero colors
│   ├── utils/
│   │   ├── calculations/
│   │   │   ├── wilson-score.ts     # Wilson Score implementation
│   │   │   └── matchup-calc.ts     # Counter hero calculations
│   │   ├── formatting/
│   │   │   ├── number.ts           # Format win rates (90.5%)
│   │   │   └── time.ts             # Format timer (2:30)
│   │   ├── validators/
│   │   │   └── hero.ts             # Validate hero picks
│   │   └── hooks/
│   │       ├── use-debounce.ts
│   │       └── use-local-storage.ts
│   ├── providers/
│   │   ├── redux-provider.tsx      # Redux Provider wrapper
│   │   └── theme-provider.tsx
│   ├── store/
│   │   ├── store.ts                # Redux store config
│   │   ├── root-reducer.ts
│   │   └── middlewares/
│   │       └── logger.ts
│   ├── types/
│   │   ├── api.ts                  # Common API response types
│   │   └── heroes.ts               # Shared hero types
│   └── layouts/
│       ├── main-layout.tsx
│       └── draft-layout.tsx
```

### 4.3 Component Pattern: UI/Logic Separation

**Philosophy:** Separate presentation from business logic for flexibility and testability.

**Example: Meta Heroes Tier Component**

```
features/meta-heroes/components/meta-tier/
├── index.tsx (wrapper, handles data fetching)
├── meta-tier.tsx (pure UI component)
└── use-meta-tier.ts (business logic hook)
```

**index.tsx:**

```typescript
export default function MetaTierWrapper() {
  const { heroes, loading } = useMetaTier();
  return <MetaTier heroes={heroes} loading={loading} />;
}
```

**meta-tier.tsx:**

```typescript
interface MetaTierProps {
	heroes: HeroWithScore[];
	loading: boolean;
}
export function MetaTier({ heroes, loading }: MetaTierProps) {
	// Pure UI, no data fetching
}
```

**use-meta-tier.ts:**

```typescript
export function useMetaTier() {
	// Redux dispatch, API calls, Wilson Score calculations
}
```

**Benefits:**

- Designers can modify UI without touching logic
- Easier testing of both UI and business logic separately
- Reusable hooks for multiple components
- Clear separation of concerns

---

## 5. State Management Approach

### Why Redux?

- **Predictable state mutations** with time-travel debugging
- **Performance optimization** with selector memoization
- **Complex async flows** (live timers, real-time updates)
- **Normalized entity storage** for efficient hero/matchup lookups

### Redux Architecture

```
Redux Store Structure:
{
  staticDraft: {
    selectedTemplate: "pro_meta_12.2",
    teamSide: "dire",
    picks: [{ order: 1, heroId: 1, team: "radiant" }],
    bans: [...],
    loading: false
  },
  liveDraft: {
    coinFlip: "radiant",
    reservedTime: { radiant: 120, dire: 120 },
    currentPhaseTime: 30,
    isPhaseActive: true,
    picks: [...],
    bans: [...],
    autoPickEnabled: false
  },
  meta: {
    heroes: { byId: {...}, allIds: [...] },
    lastUpdated: timestamp
  },
  entities: {
    heroes: { byId: {...}, allIds: [...] },
    counters: { byHeroId: {...} }
  }
}
```

### Slices & Thunks

Each feature has its own Redux slice:

- `static-draft.slice.ts` - Pick/ban logic
- `live-draft.slice.ts` - Timer management, auto-pick
- `meta.slice.ts` - Meta heroes with Wilson scores
- `entities/hero.slice.ts` - Normalized hero data

**Async Operations:**

```typescript
// Example: Fetch live draft recommendations
export const fetchCounterHeroes = createAsyncThunk(
	'liveDraft/fetchCounters',
	async (heroIds: number[]) => {
		// Query performance_of_heroes from Supabase
	},
);
```

---

## 6. Data Flow Overview

### 6.1 Conceptual Flow

```
UI (Components)
    ↓
Redux Actions / Hooks
    ↓
Redux Store (State Management)
    ↓
API Layer (Next.js API routes → Supabase)
    ↓
Database (Supabase)
    ↑ (realtime subscriptions for live draft)
```

### 6.2 Data Sources: API vs Local

| Data                      | Source             | Persistence                     | Frequency               |
| ------------------------- | ------------------ | ------------------------------- | ----------------------- |
| **Heroes (basic)**        | API on mount       | Redux store                     | Once per session        |
| **Hero win rates (meta)** | API on mount       | Redux store                     | Once per session        |
| **Wilson Scores**         | Calculated locally | Not persisted                   | Computed on render      |
| **Meta by duration**      | API on demand      | Redux store                     | Cached                  |
| **Counter matchups**      | API on hero select | Redux store                     | Fetched per selection   |
| **Draft picks/bans**      | Local state + DB   | Redux store + Browser IndexedDB | Real-time in live draft |
| **User draft history**    | API on page load   | Redux store + Browser cache     | Paginated fetch         |
| **Live timers**           | Calculated locally | Local state                     | Updated every 100ms     |

### 6.3 Detailed Data Flow Example: Live Draft Pick

```
User clicks hero
    ↓
Dispatch Redux action: pickHero({ heroId, team, order })
    ↓
Middleware validates:
  - Hero not already picked/banned
  - Order is correct
  - Time remaining > 0
    ↓
    ├─ Valid:
    │   ├─ Update Redux: picks.push(...)
    │   ├─ Send to API: POST /api/live-drafts/:id/pick
    │   ├─ Supabase saves to draft_picks table
    │   ├─ Broadcast to other users (realtime)
    │   ├─ Trigger counter-hero fetch
    │   └─ UI updates via Redux selector
    │
    └─ Invalid:
        └─ Show error toast (via error slice)
```

### 6.4 API Routes Structure

```
/api/
├── /drafts
│   ├── GET - List user drafts (pagination)
│   ├── POST - Create new draft
│   └── /:id
│       ├── GET - Get draft details
│       ├── PUT - Update draft
│       └── /pick (POST) - Record pick during live draft
│
├── /heroes
│   ├── GET - Get all heroes (cached)
│   └── /:id/counters (GET) - Get counter matchups
│
├── /meta
│   ├── /heroes (GET) - Get meta heroes with Wilson scores
│   └── /heroes-by-duration (GET) - Get impacted heroes per stage
│
└── /analytics
    └── /draft-stats (GET) - Stats for past drafts
```

---

## 7. Error Handling Approach

### 7.1 Error Categories

| Type                 | Cause                          | Handling                       |
| -------------------- | ------------------------------ | ------------------------------ |
| **Validation Error** | Invalid pick/ban action        | Show toast + disable button    |
| **Network Error**    | API timeout                    | Retry toast + offline state    |
| **State Error**      | Invalid Redux state transition | Log + fallback to default      |
| **Auth Error**       | Session expired                | Redirect to login              |
| **Database Error**   | Supabase failure               | Show error modal + fallback UI |

### 7.2 Error Handling Strategy

**Frontend Layer:**

```typescript
// Redux middleware with error handling
const errorMiddleware = (store) => (next) => (action) => {
	try {
		return next(action);
	} catch (error) {
		store.dispatch(
			errorSlice.actions.setError({
				message: error.message,
				type: 'error',
				duration: 5000,
			}),
		);
		logErrorToSentry(error);
	}
};
```

**Component Layer:**

```typescript
// Error boundary for critical sections
<ErrorBoundary fallback={<DraftErrorFallback />}>
  <LiveBoard />
</ErrorBoundary>
```

**API Layer:**

```typescript
// Try-catch with specific error responses
async function pickHero(heroId) {
	try {
		const response = await fetch('/api/drafts/:id/pick', {
			method: 'POST',
			body: JSON.stringify({ heroId }),
		});
		if (!response.ok) throw new ApiError(response);
		return response.json();
	} catch (error) {
		if (error instanceof NetworkError) {
			// Retry logic with exponential backoff
		} else {
			dispatch(setError(error.message));
		}
	}
}
```

### 7.3 User Feedback

- **Toast notifications** for non-critical errors (pick validation failed)
- **Error modal** for critical errors (cannot load heroes)
- **Inline validation** for form errors using React Hook Form
- **Fallback UI** for failed components (loading skeleton or empty state)

---

## 8. What Was Intentionally Not Built and Why

### 8.1 Real-Time Multiplayer Sync

**Why Not:**

- Significantly increases backend complexity (WebSocket infrastructure)
- User research indicates primarily single-player usage pattern
- Could be added as future enhancement if needed

**Future Path:** Add Supabase realtime subscriptions for watch-party feature

### 8.2 Advanced Analytics Dashboard

**Why Not:**

- Beyond MVP scope (requires data aggregation pipeline)
- Users primarily care about current draft, not historical trends
- Planned as Phase 2 feature after core draft mechanics validated

**Future Path:** Build analytics service with scheduled SQL aggregations

### 8.3 Mobile-First Responsive Design

**Why Not:**

- Dota 2 draft is complex, suited to desktop
- API requires precise hover/click interactions
- Initial launch targets desktop users (competitive players)

**Future Path:** Responsive tablet support added after core stabilizes

### 8.4 Social Features (leaderboard, sharing)

**Why Not:**

- Privacy concerns with competitive gaming
- Minimal demand in user research interviews
- Adds auth/profile complexity

**Future Path:** Shareable draft links (read-only) for replay sharing

### 8.5 Draft Simulation AI

**Why Not:**

- Requires ML model training on professional player data
- Computational overhead for real-time recommendations
- Wilson Score + matchup data provides sufficient guidance

**Future Path:** Train ensemble model if meta hero recommendations insufficient

### 8.6 Offline-First PWA

**Why Not:**

- Draft requires real-time meta data sync
- Network issues unlikely in competitive environment
- SimpleStorage fallback adequate for non-critical data

**Future Path:** Service worker caching for hero data if offline needed

### 8.7 Admin Dashboard for Rules Management

**Why Not:**

- Rules changes are infrequent (per major patch)
- Manual database updates acceptable for current volume
- RBAC system adds frontend/backend complexity

**Future Path:** Add admin panel if frequent rule updates needed

---

## 9. Feature Priority & Timeline

### MVP (Phase 1 - Current)

- ✅ Static Draft (unlimited time)
- ✅ Live Draft with timers
- ✅ Draft History viewer
- ✅ Hero pool with meta rankings
- ✅ Counter suggestions

### Phase 2 (Planned)

- 📋 Replay analytics
- 📋 Draft import/export
- 📋 Team presets (save favorite compositions)

### Phase 3+ (Future)

- 📋 Real-time multiplayer
- 📋 Advanced statistics
- 📋 AI draft suggestions
- 📋 Mobile responsive

---

## 10. Database Schema (Supabase)

### Key Tables

```sql
-- Heroes
CREATE TABLE heroes (
  id INT PRIMARY KEY,
  name VARCHAR UNIQUE,
  attribute VARCHAR, -- Strength, Agility, Intelligence
  role VARCHAR[]
);

-- Draft Templates
CREATE TABLE template_draft_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  max_order INT (default 24),
  pick INT (default 10),
  ban INT (default 12)
);

-- Meta Heroes (computed)
CREATE TABLE meta_heroes (
  id SERIAL PRIMARY KEY,
  hero_id INT REFERENCES heroes,
  duration VARCHAR, -- 'early', 'mid', 'late'
  win_rate DECIMAL,
  pick_rate DECIMAL,
  game_count INT,
  wilson_score DECIMAL,
  created_at TIMESTAMP
);

-- Hero Performance (matchups)
CREATE TABLE performance_of_heroes (
  id SERIAL PRIMARY KEY,
  hero_id INT,
  enemy_hero_id INT,
  win_rate DECIMAL,
  sample_size INT
);

-- User Drafts
CREATE TABLE draft_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  template_id INT REFERENCES template_draft_rules,
  team_side VARCHAR, -- 'radiant', 'dire'
  status VARCHAR, -- 'in_progress', 'completed'
  created_at TIMESTAMP
);

CREATE TABLE draft_picks (
  id SERIAL PRIMARY KEY,
  draft_id INT REFERENCES draft_sessions,
  hero_id INT,
  team VARCHAR,
  order INT,
  pick_time INT, -- seconds taken
  created_at TIMESTAMP
);
```

---

## 11. Deployment & Environment

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
NEXT_PUBLIC_API_BASE_URL=
```

### Hosting

- **Frontend:** Vercel (Next.js auto-deployment)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (if needed for replay videos)

---

## 12. Performance Considerations

### Redux Selectors (Memoization)

```typescript
// Reselect for expensive computations
export const selectRankedMetaHeroes = createSelector(
	[selectMetaHeroes, selectDurationFilter],
	(heroes, duration) => rankByWilsonScore(heroes, duration),
);
```

### Code Splitting

- Feature routes lazy-loaded via Next.js dynamic imports
- Redux slices normalized for minimal bundle size

### Caching Strategy

- Heroes data: Session storage (expires on refresh)
- Meta heroes: 1-hour TTL (refreshed in background)
- User drafts: Browser IndexedDB for offline-first

---

## 13. Testing Strategy

### Unit Tests

- Wilson Score calculation
- Matchup calculations
- Validation logic

### Integration Tests

- Redux state mutations
- API integration
- Component state flows

### E2E Tests

- Static draft flow (setup → pick → summary)
- Live draft flow (timers → auto-pick)
- History view

---

This design balances competitive features with maintainability, providing clear separation of concerns while enabling rapid iteration on the core draft mechanics.
