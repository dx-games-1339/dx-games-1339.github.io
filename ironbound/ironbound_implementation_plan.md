# Ironbound — Implementation Plan

**Based on:** Game Design Document v3.6-draft (docs_v24.md)  
**Target:** Single-page application (`index.html`) hosted on GitHub Pages  
**Renderer:** WebGL 2D canvas with HTML/CSS UI overlays  
**Constraint:** No build system, no npm, no external dependencies except optional Google Fonts

Each step produces a working, runnable `index.html` that builds directly on the previous one. No step discards prior work. Each step is submitted for review and approval before implementation begins.

---

## Step 1 — Shell, Game State Schema, Launch Menu, Save/Load

**Delivers:**
- Single `index.html` with the complete `GameState` object schema stubbed in JavaScript, matching the schema in Section 11.2 of the GDD
- Launch menu (Section 12.1) with three buttons: New Game, Load Game, Launch Test Scenario
- World Options form (Section 12.2) with all six fields and their documented defaults:
  - Organization name (default: "The Guild")
  - Starting gold (default: 4200)
  - Starting characters (default: 0, range 0–9)
  - Target world POIs (default: 20, range 10–50)
  - Map size (default: 128, range 64–256)
  - Target publicly known POIs (default: 8, range 6–Target world POIs)
- Confirming New Game initialises an empty `GameState` object (no world generated yet)
- Load Game opens a browser file picker, parses a `.json` save file, and restores state
- Save function serialises `GameState` to JSON and triggers a browser file download
- Autosave to `localStorage` every N turns (configurable)
- Error handling: invalid save file displays an error message and returns to launch menu

**Foundation this establishes:**
- File structure for all subsequent steps
- The `GameState` object that every system reads from and writes to
- The entry point (launch menu) that all navigation flows through
- Save/load pipeline that works end to end from day one

---

## Step 2 — World Generation, Terrain, Cities, Global Map Rendering

**Delivers:**
- Procedural terrain generation via noise function producing a grid of tiles: forest, plains, hills, water
- Exactly 3 cities placed at stable positions with guaranteed minimum spacing
- Road connections rendered as lines between the 3 cities
- One city randomly assigned as the player's starting HQ city
- WebGL 2D canvas filling the full viewport, rendering the terrain grid
- Pan (click-and-drag) and zoom (scroll wheel) on the global map
- Cities rendered as named markers on the canvas
- Map size determined by the world option set in Step 1
- Toolbar always visible: turn counter, gold balance, roster count, End Turn button

**Depends on:** Step 1 (GameState, world options)

---

## Step 3 — POI Spawning, Despawn Timers, Global Map POI Display, Turn Advance

**Delivers:**
- POI spawn system using terrain affinity weights (certain POI types more likely in certain terrain)
- POIs placed on the global map with Discovered / Undiscovered states
- Target world POIs count maintained — new POIs spawn when active count falls below target
- Despawn timer on each POI counting down each turn
- End Turn button advancing the game clock by 1 turn
- Turn order Step 1 (world consistency check) running each turn: expired POIs removed, new ones spawned
- POIs rendered on the global map as markers distinct from cities
- Undiscovered POIs visible on the map (location shown) but not interactable
- Clicking a POI opens a placeholder info panel (POI name, type, turns until despawn)
- Target publicly known POIs world option determines how many spawn as Discovered by default

**Depends on:** Steps 1–2

---

## Step 4 — Recruit System, Character Schema, HQ City Layout, Roster Panel

**Delivers:**
- Full `Recruit` schema populated at game start using the Starting characters world option
- Characteristics randomly initialised within documented ranges (health 90–130, movement speed, etc.)
- Traits assigned at initialisation with mutual exclusivity enforced (up to 2 traits per character)
- City Layout panel opens when clicking a city on the global map
- Market panel stub (items visible, no purchase mechanic yet)
- Tavern / Recruitment panel: generated hire pool with names and hiring costs, weekly refresh
- HQ panels visible only when the selected city is the HQ city:
  - Roster: full list of recruits with stats, conditions, equipment, assignment status
  - Storeroom: empty but rendered, with For Sale section stub
  - Ledger: empty but rendered
  - Group Manager: stub panel
  - Staff Assignments: stub panel with the 4 HQ tasks listed
- **Exit to Menu button** in the toolbar — pressing it discards the current session and returns the player to the launch menu. A confirmation prompt prevents accidental loss of unsaved progress.
- **Launch menu title colour** — the "IRONBOUND" title on the launch menu is updated to a green hue instead of amber.
- **Toolbar overflow fix** — the End Turn button disappeared in Step 3 due to a CSS layout overflow caused by the addition of the POIs stat pushing toolbar content beyond the toolbar's fixed width. The toolbar layout is corrected so all stats and buttons are always visible and accessible regardless of viewport width. End Turn functionality is verified working after the fix.

**Depends on:** Steps 1–3

---

## Step 5 — Groups, Group Manager, Group Tokens on Global Map, Travel

**Delivers:**
- Group creation, naming, and member assignment in the HQ Group Manager panel
- Groups can contain 1–9 recruits; roles (Scout, Combat, Supply, Rescue) assignable as labels
- Group tokens rendered on the global map as rhombus portrait grids:
  - 1–4 members: 2×2 grid, empty positions blank
  - 5–9 members: 3×3 grid
  - Center portrait displayed larger than edge portraits
- Group Panel opens when clicking a group token
- Groups can be assigned to travel to cities or Discovered POIs
- Travel time calculated as `distance / group_speed` (slowest member's speed)
- Groups move turn by turn along their assigned route, token position updates each turn
- Travel route displayed as a line on the global map while group is in transit
- Daily schedule: 6-turn pattern, default turn 6 as rest turn, configurable per group
- Groups can be split or merged at HQ or in the same POI zone

- **POI popup stale data fix** — when a POI popup is open and the player clicks End Turn, the popup displays the despawn timer value from before the turn advanced, making it immediately incorrect. `advanceTurn` is updated to close any open map popup before processing the turn, so the player always reopens the popup to see fresh data rather than reading a stale value.

**Depends on:** Steps 1–4

---

## Step 6 — POI Layout, Zone Graph, Zone Detail Panel, Object Awareness System

**Delivers:**
- POI zone graph generated per POI type (linear, branching, hub-and-spoke, complex)
- Zones rendered as clickable nodes on the WebGL canvas with passages as edges
- Entry zone always revealed and Scouted on group arrival; all others begin Unknown
- Zone states: Unknown (dim, question mark) and Scouted (summary icon)
- Full object visibility generation on POI spawn (Section 4.3.1):
  - `_discover_value` and `_visibility_value` assigned per object (0–4)
  - `faction_visibility_max = 2 ^ _discover_value × 300`
  - `initial_objects_visibility = (faction_visibility_max / 5) × _visibility_value`
  - Starting visibility rolled in `[0.5 × initial, initial]`
  - `upper_bound_visibility` rolled in `[0.8 × max, 1.2 × max]`
- Faction awareness map initialised on zone entry (faction visibility set to object's `visibility`)
- Awareness state evaluation: Undiscovered (<40%), Known (≥40%), Located (>90%) of upper_bound
- Zone Detail Panel displays Located and Known objects from player faction perspective
- Object icon shape rules: rhombus for living, square for non-living and dead bodies
- Dev Mode toggle: reveals all hidden state (Undiscovered objects, Unknown zones, numeric visibility values)

**Depends on:** Steps 1–5

---

## Step 7 — Action Execution Cycle, Scout Zone, Search For, Conceal, Hide

**Delivers:**
- Full action point system: 50 AP per turn, per-attempt progress accumulation, carry-over between turns, reset on reassignment
- Action cost increase modifier from head wounds: base cost × (1 + increase%), rounded up, capped at 50
- Scout Zone action:
  - Passive per-attempt tick: `⌈0.25 × perception⌉` added to faction visibility of ALL objects per 5 AP investment
  - Active discovery pulse on full execution: discovery_value formula, random [2,6] objects selected, discovery_value added to each, capped at upper_bound, immediate state re-evaluation
- Search for action (Known objects only):
  - No passive tick
  - On execution: focused increase `[0.8 × dv, 1.75 × dv]` on target; secondary flat `0.8 × dv` on [1,5] random other objects
- Conceal action:
  - Base visibility: `⌊object.visibility × 0.9⌋`
  - Faction visibility: `⌊factionAwareness × 0.9⌋` for all Located factions except performer
  - Re-evaluation: Located factions may revert to Known
- Hide action:
  - Raises group's `upper_bound_visibility` (runtime value for living objects)
  - All factions with visibility entries re-evaluated; may lose Located state
- Actions assignable from Zone Detail Panel with progress bars displayed

**Depends on:** Steps 1–6

---

## Step 8 — Damage System, Wound System, Incapacitation, Death

**Delivers:**
- Full damage pipeline (Section 4.9):
  - `R = raw_damage / character_current_health`
  - Sigmoid gate function and raw weight calculations for all 5 severity tiers
  - Normalisation to probabilities
  - Wound slot selection, +200 charge injection on occupied slots
  - Incapacitation check: `raw_damage ≥ current_health`
- Incapacitation status effect: `min(200, 40 + 20 × (max_health / current_health))` initial charges, −20/turn depletion
- Wound-triggered incapacitation on final-stage progressive wound progression
- Human race wound table fully implemented (left arm, right arm, left leg, right leg, head, chest, stackable, special)
- Wound charge accumulation per turn (degeneration range roll − regeneration roll)
- Wound progression on max charges reached; wound-triggered incapacitation at final stage
- Treat action: transforms wound to bandaged variant (negative degeneration, heals to zero)
- Death: effective max health ≤ 0, or lethal wound applied
- Body persistence: dead character remains in zone as inspectable non-living object, frozen status, lootable equipment
- Zone hazard conditions applying probabilistic damage per Scout Zone attempt

**Depends on:** Steps 1–7

---

## Step 9 — Hunger System, Food, Economy, Market, Selling, Upkeep

**Delivers:**
- Hunger system (Section 5.6): Hunger → Starvation → Famine → Starved to Death stage progression
- Charge accumulation per turn per stage; stat penalties applied at Starvation and Famine
- Eat action (5 AP): consumes highest Food-value item, reduces charges, can chain regression
- Auto-eat task self-inserted when Hunger charges exceed 80
- Rest eating: consumes food until charges ≤ 20, Delicious items prioritised, loyalty bonuses applied
- Monthly upkeep: `base_rate × current_level` per character, Greedy trait +10% to base rate, deducted turn 1 of last day of month
- Storeroom For Sale section: summed gold range display, single roll on Sell, ledger entry
- Market For Purchase box: summed range, market tax (10% default), affordability gate on taxed_max, buy roll, items moved to Storeroom
- Items from POI zones (picked up via Take) flow to Storeroom misc inventory on group return to HQ
- Full Ledger recording all transactions with turn number

**Depends on:** Steps 1–8

---

## Step 10 — Group Automation, Task System, Maintenance Lifecycle, Full Turn Order

**Delivers:**
- Full task list per group: ordered queue, top-down priority scanning
- Local actions: direct zone action assignments
- Abstract goals: Gather valuables, Gather specific resource, Explore, Encamp
  - Goal decomposition generating sub-tasks automatically
  - Give-up counter (default 7 turns) cancels stalled goals
  - Goal lifetime counting from first execution turn
- Task assignment suitability scoring (characteristic + equipped tool matching)
- Character-initiated self-assigned tasks (eat, rest, wound treatment)
- Group maintenance lifecycle checks each turn (food shortfall redistribution, injured member treatment insertion)
- Override maintenance lifecycle flag per group
- Zone travel allowed flag per group
- Full 8-step turn order wired end to end:
  1. World consistency check
  2. Monthly financial operations
  3. Weekly rotation (Tavern refresh, Market rotation)
  4. Maintenance lifecycle checks
  5. Task assignment
  6. Character action determination
  7. Action resolution
  8. Status effect update

**Depends on:** Steps 1–9

---

## Notes for Implementation

- All steps produce a single self-contained `index.html` with inlined CSS and JavaScript
- WebGL shaders are inlined in the same file
- No external image assets — all graphics are procedurally drawn shapes and outlines
- The GDD documents several systems as **not yet fully specified** (wound max charges, regeneration formula, perception/dexterity ranges, Treat action AP cost, zone-to-zone distance). Placeholder values will be used for these and flagged clearly in code comments for later tuning
- Dev Mode (Section 14) will be implemented alongside Step 6 and carried forward, exposing all hidden numeric state for testing throughout development
