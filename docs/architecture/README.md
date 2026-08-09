# Trifoglio Architecture

This folder captures architecture decisions for evolving Trifoglio into a generic IIIF document feature platform.

## Scope

- Modular ES6 architecture
- Compatibility with Leaflet, Leaflet Draw, Leaflet-IIIF
- Domain-first model (Project, Layer, Feature)
- Event-driven coordination between modules

## Module Overview

- UI Shell: presentation only, no business logic
- Application Core: use-case orchestration and transaction boundaries
- Event Bus: publish/subscribe for domain and infrastructure events
- Project Module: project lifecycle and global state
- Document IIIF Module: manifest/canvas loading and normalization
- Viewer Module: Leaflet adapters for map and raster layers
- Feature Module: lifecycle for graphical user features
- Layer Module: grouping, ordering, visibility, lock and color semantics
- Metadata Module: free key/value properties and optional schema profiles
- Style Module: feature/layer visual style and inheritance rules
- Storage Module: persistence, autosave and snapshots
- Import/Export Module: external format boundaries
- Plugin Module: extension points and hook registration

## Dependency Rules

- UI depends only on Application Core
- Core can depend on all modules
- Domain modules communicate primarily through Event Bus
- Viewer is an infrastructure adapter, not the source of business truth
- Storage is accessed through domain services, not directly by UI

## Event Families

- Project events: create/open/save/close/state-changed
- IIIF events: manifest load requested/loaded/failed, canvas changed
- Feature events: create/update/delete/select/deselect
- Layer events: create/rename/reorder/visibility/lock/delete
- Persistence events: autosave requested/completed/failed
- Plugin events: loaded/action requested/action completed/error

## Domain Objects

- Project
- IiifDocument
- CanvasRef
- Layer
- Feature
- FeatureProperties
- MetadataEntry
- ViewerState
- ProjectPreferences
- Attachment (future)

## Lifecycle References

- Project lifecycle: see ADR-004
- Feature lifecycle: see ADR-005

## ADR Index

- ADR-001: ES6 Modular Architecture
- ADR-002: Event-Driven Coordination
- ADR-003: Canonical Domain Model
- ADR-004: Project Lifecycle
- ADR-005: Feature Lifecycle
- ADR-006: Extension Strategy

## Contracts

- contracts/EVENT-CONTRACTS.md
- contracts/MODULE-CONTRACTS.md

## Schemas

- schemas/PROJECT-MODEL-V1.md

## Migration

- MIGRATION-PLAN.md
- MIGRATION-BACKLOG.md
- MIGRATION-ISSUES.md
