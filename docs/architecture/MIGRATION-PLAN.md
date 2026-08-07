# Migration Plan

This plan defines a progressive migration from the current Trifoglio codebase to the target modular ES6 architecture.

## Objectives

- Keep the application usable at every step.
- Avoid big-bang rewrites.
- Preserve compatibility with Leaflet, Leaflet Draw, and Leaflet-IIIF.
- Introduce Project/Layer/Feature as canonical business objects.

## Current Baseline

- Runtime: browser-based ES modules/scripts around Leaflet ecosystem.
- Main orchestration concentrated in main.js.
- Persistence primarily localStorage-oriented.
- i18n in transition state with runtime translation bridge.

## Migration Strategy

- Strangler pattern: introduce new modules around existing code, then shrink legacy core.
- Feature flags per major capability.
- Event-first integration: publish events before replacing internals.
- Contract-first: align implementation with EVENT-CONTRACTS and PROJECT-MODEL-V1.

## Phases

### Phase 0 - Stabilization and Inventory

Scope:

- Freeze architectural scope for the next iterations.
- Inventory all user flows and data mutations.
- Add baseline observability points (logs around load/save/create/edit/delete).

Deliverables:

- Flow inventory document.
- Mutation map (where project state changes).
- Regression checklist.

Acceptance criteria:

- All current core flows are documented end-to-end.
- Known breakpoints and side effects are identified.

### Phase 1 - Domain and Contract Foundations

Scope:

- Introduce canonical model mapping in a dedicated domain adapter layer.
- Normalize naming to Project/Layer/Feature in implementation boundaries.
- Implement event envelope and publish core events in parallel with current logic.

Deliverables:

- Domain adapter specification.
- Event publisher interface and event registry.
- Mapping tables from legacy structures to canonical model.

Acceptance criteria:

- Every major mutation emits a canonical event.
- Canonical IDs are stable for Project/Layer/Feature.
- No behavior regression in drawing, loading, saving.

### Phase 2 - Module Extraction (Non-Disruptive)

Scope:

- Extract modules without changing behavior:
  - Viewer Module
  - Document IIIF Module
  - Feature Module
  - Layer Module
  - Storage Module
- Keep legacy main.js as composition root temporarily.

Deliverables:

- Module boundaries with explicit public APIs.
- Dependency map updated after each extraction.

Acceptance criteria:

- Extracted module can be tested in isolation.
- Legacy integration still passes regression checklist.
- No direct UI to Storage calls remain.

### Phase 3 - Persistence and Project Lifecycle

Scope:

- Introduce Project service as source of truth for lifecycle.
- Move autosave/snapshot logic into Storage Module.
- Add modelVersion and migration hooks for persisted snapshots.

Deliverables:

- Project lifecycle state machine.
- Snapshot format V1 aligned with PROJECT-MODEL-V1.
- Migration routines for pre-V1 local data.

Acceptance criteria:

- Open/save/close lifecycle transitions are deterministic.
- Old local data can be loaded or safely rejected with clear reason.
- Autosave reliability verified by scenario tests.

### Phase 4 - UI Shell Decoupling

Scope:

- Convert UI interactions to command handlers invoking Application Core.
- Remove business logic from direct DOM handlers.
- Centralize state-to-UI rendering adapters.

Deliverables:

- UI command map.
- View model mapper specs.

Acceptance criteria:

- UI is replaceable without rewriting domain services.
- Main user flows unchanged from user perspective.

### Phase 5 - Plugin and Extension Enablement

Scope:

- Add plugin registration lifecycle.
- Expose extension points for metadata profiles, import/export, validators.
- Harden event contracts for third-party handlers.

Deliverables:

- Plugin manifest contract.
- Extension capability matrix.

Acceptance criteria:

- At least one internal plugin prototype works end-to-end.
- Plugin failures are isolated and observable.

### Phase 6 - Legacy Decommission

Scope:

- Remove obsolete legacy paths and dead code.
- Finalize documentation and architecture conformance checks.

Deliverables:

- Decommission checklist.
- Final architecture conformance report.

Acceptance criteria:

- No critical path depends on deprecated legacy branch.
- Documentation and implementation are aligned.

## Workstreams

- WS1 Domain model and contracts
- WS2 Viewer and IIIF integration
- WS3 Feature and Layer operations
- WS4 Persistence and migration
- WS5 UI decoupling
- WS6 Quality and release

## Quality Gates

Each phase must pass:

- Functional regression checklist
- Event contract validation
- Persistence compatibility checks
- Performance smoke checks (load manifest, switch canvas, draw/edit/delete feature)

## Risks and Mitigations

1. Risk: hidden coupling in main.js

- Mitigation: progressive extraction with adapter wrappers and event mirroring.

2. Risk: data migration inconsistencies

- Mitigation: explicit modelVersion and deterministic migration scripts with backups.

3. Risk: plugin API instability

- Mitigation: versioned extension contracts and compatibility policy.

4. Risk: UI regressions during decoupling

- Mitigation: scenario-based regression suite and feature flags.

5. Risk: performance degradation from event indirection

- Mitigation: lightweight payloads, bounded handlers, and profiling checkpoints.

## Rollback Strategy

- Keep feature flags for each extracted module.
- Keep legacy path callable during transition phases.
- Snapshot before migrations and support restore.

## Suggested Iteration Order

1. Phase 0 + Phase 1
2. Phase 2 (Viewer + IIIF first)
3. Phase 2 (Feature + Layer)
4. Phase 3
5. Phase 4
6. Phase 5
7. Phase 6

## Definition of Done (Program Level)

- Architecture modules are implemented with clear boundaries.
- Canonical events and schema are enforced in runtime and tests.
- Project and Feature lifecycle are deterministic and documented.
- Legacy monolithic orchestration is removed from critical path.
