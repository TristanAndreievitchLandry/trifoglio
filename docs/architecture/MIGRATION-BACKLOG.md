# Migration Backlog

This backlog translates MIGRATION-PLAN into executable work items.

## Prioritization Scale

- P0: critical path, blocks architecture transition
- P1: high value, should follow immediately
- P2: important but can be parallelized later

## Epic E0 - Program Setup and Governance (Phase 0)

### E0-T1 - Architecture Scope Freeze

- Priority: P0
- Depends on: none
- Description: freeze architectural scope for first migration wave.
- Deliverable: signed scope statement.
- Done when: scope, constraints, and non-goals are approved.

### E0-T2 - User Flow Inventory

- Priority: P0
- Depends on: E0-T1
- Description: document all core user flows.
- Deliverable: flow matrix (load manifest, canvas navigation, draw/edit/delete feature, save/export).
- Done when: each flow has entry point, state mutations, and expected outputs.

### E0-T3 - Mutation Map

- Priority: P0
- Depends on: E0-T2
- Description: list every place where project state is mutated.
- Deliverable: mutation map with file/module references.
- Done when: all critical state mutations are catalogued.

### E0-T4 - Regression Checklist Baseline

- Priority: P0
- Depends on: E0-T2
- Description: define manual/automated checklist for no-regression validation.
- Deliverable: baseline checklist.
- Done when: checklist is executable by another contributor.

## Epic E1 - Domain and Event Foundations (Phase 1)

### E1-T1 - Domain Adapter Boundary

- Priority: P0
- Depends on: E0-T3
- Description: define adapter between legacy runtime state and canonical Project/Layer/Feature model.
- Deliverable: adapter boundary spec.
- Done when: inputs/outputs and mapping rules are documented.

### E1-T2 - Canonical ID Policy

- Priority: P0
- Depends on: E1-T1
- Description: define ID generation and stability rules for Project, Layer, Feature.
- Deliverable: ID policy note.
- Done when: ID behavior is deterministic across edits and reloads.

### E1-T3 - Event Envelope Runtime Contract

- Priority: P0
- Depends on: E1-T1
- Description: enforce event envelope fields from EVENT-CONTRACTS.
- Deliverable: validation checklist for envelope fields.
- Done when: every emitted event has required envelope fields.

### E1-T4 - Event Emission Coverage

- Priority: P1
- Depends on: E1-T3
- Description: emit canonical events for core mutations.
- Deliverable: event coverage matrix.
- Done when: create/update/delete/save/load mutations are covered.

## Epic E2 - Module Extraction (Phase 2)

### E2-T1 - Viewer Module Extraction

- Priority: P0
- Depends on: E1-T4
- Description: isolate Leaflet and Leaflet-IIIF interactions behind Viewer module API.
- Deliverable: viewer boundary and public API list.
- Done when: caller code does not manipulate Leaflet internals directly.

### E2-T2 - IIIF Document Module Extraction

- Priority: P0
- Depends on: E2-T1
- Description: isolate manifest parsing and canvas/service discovery.
- Deliverable: normalized IIIF document service contract.
- Done when: IIIF parsing is not spread across orchestration code.

### E2-T3 - Feature Module Extraction

- Priority: P1
- Depends on: E2-T1
- Description: isolate feature lifecycle operations.
- Deliverable: feature service API.
- Done when: create/edit/delete/select flows route through feature service.

### E2-T4 - Layer Module Extraction

- Priority: P1
- Depends on: E2-T3
- Description: isolate layer ordering/visibility/locking/color behavior.
- Deliverable: layer service API.
- Done when: layer behavior is no longer embedded in orchestration scripts.

### E2-T5 - Storage Module Extraction

- Priority: P1
- Depends on: E1-T1
- Description: centralize persistence calls and serialization.
- Deliverable: storage provider interface.
- Done when: UI and ad hoc logic no longer directly touch persistence primitives.

## Epic E3 - Persistence and Lifecycle (Phase 3)

### E3-T1 - Project Service State Machine

- Priority: P0
- Depends on: E2-T2, E2-T3, E2-T4, E2-T5
- Description: formalize project lifecycle transitions.
- Deliverable: lifecycle state transition table.
- Done when: open/save/close are deterministic transitions.

### E3-T2 - Snapshot V1 Format

- Priority: P0
- Depends on: E1-T1, E3-T1
- Description: implement storage format aligned with PROJECT-MODEL-V1.
- Deliverable: snapshot schema conformance checklist.
- Done when: persisted project validates against V1 schema.

### E3-T3 - Legacy Data Migration

- Priority: P0
- Depends on: E3-T2
- Description: define deterministic migration from pre-V1 saved data.
- Deliverable: migration strategy and fallback behavior.
- Done when: old data either migrates successfully or fails with clear reason.

### E3-T4 - Autosave Reliability

- Priority: P1
- Depends on: E3-T1, E3-T2
- Description: move autosave orchestration into storage/project services.
- Deliverable: autosave scenario tests.
- Done when: autosave is stable under rapid feature edits.

## Epic E4 - UI Decoupling (Phase 4)

### E4-T1 - UI Command Map

- Priority: P1
- Depends on: E2-T3, E2-T4, E3-T1
- Description: map UI actions to application commands.
- Deliverable: command map table.
- Done when: business actions are command-driven, not DOM-driven.

### E4-T2 - View Model Mapping

- Priority: P1
- Depends on: E4-T1
- Description: define mapping from domain state to UI state.
- Deliverable: view model adapter spec.
- Done when: UI rendering consumes mapped state only.

### E4-T3 - Remove UI-to-Storage Coupling

- Priority: P1
- Depends on: E2-T5, E4-T1
- Description: ensure storage access only via core/domain services.
- Deliverable: coupling audit.
- Done when: no direct UI persistence calls remain.

## Epic E5 - Extension Enablement (Phase 5)

### E5-T1 - Plugin Manifest Contract

- Priority: P2
- Depends on: E1-T3, E2-T3, E2-T4
- Description: define plugin registration metadata and lifecycle hooks.
- Deliverable: plugin contract document.
- Done when: plugin capabilities can be validated pre-load.

### E5-T2 - Metadata Profile Extension Point

- Priority: P2
- Depends on: E5-T1
- Description: allow external metadata schemas/validators.
- Deliverable: metadata profile extension spec.
- Done when: at least one alternate profile can be registered.

### E5-T3 - Import/Export Connector Extension Point

- Priority: P2
- Depends on: E5-T1
- Description: define contract for additional data formats.
- Deliverable: connector interface spec.
- Done when: one non-default connector prototype is supported.

## Epic E6 - Legacy Decommission (Phase 6)

### E6-T1 - Deprecated Path Audit

- Priority: P1
- Depends on: E3-T4, E4-T3
- Description: identify remaining legacy code paths in critical workflows.
- Deliverable: decommission checklist.
- Done when: all critical paths are mapped to modular architecture.

### E6-T2 - Remove Obsolete Branches

- Priority: P1
- Depends on: E6-T1
- Description: remove dead code and obsolete fallback paths.
- Deliverable: cleanup report.
- Done when: no active feature depends on deprecated branches.

### E6-T3 - Architecture Conformance Review

- Priority: P1
- Depends on: E6-T2
- Description: verify implementation against ADRs, contracts and schemas.
- Deliverable: conformance report.
- Done when: no high-severity divergence remains.

## Dependency Summary (High Level)

1. E0 -> E1
2. E1 -> E2
3. E2 -> E3
4. E3 -> E4
5. E1/E2 -> E5
6. E3/E4 -> E6

## Suggested Sprint Grouping

### Sprint A

- E0-T1, E0-T2, E0-T3, E0-T4
- E1-T1, E1-T2

### Sprint B

- E1-T3, E1-T4
- E2-T1, E2-T2

### Sprint C

- E2-T3, E2-T4, E2-T5
- E3-T1

### Sprint D

- E3-T2, E3-T3, E3-T4
- E4-T1

### Sprint E

- E4-T2, E4-T3
- E5-T1

### Sprint F

- E5-T2, E5-T3
- E6-T1, E6-T2, E6-T3

## Tracking Template

For each task track:

- owner
- status (todo | in-progress | blocked | done)
- start date
- target date
- risks
- evidence links (PR, doc, test report)
