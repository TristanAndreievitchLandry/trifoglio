# ADR-005: Feature Lifecycle

## Status

Accepted

## Context

A feature is a central business object. Geometry and properties must evolve consistently across user operations.

## Decision

Adopt an explicit feature lifecycle:

1. Draft (geometry capture)
2. Created (persistent identity assigned)
3. Enriched (properties/style/tags/popup updated)
4. Active (select/edit/move/reshape)
5. Locked (optional, non-editable)
6. Deleted (soft or hard according to policy)

## Rules

- Feature properties are independent of geometry type
- Geometry edits do not change Feature identity
- Layer membership is explicit and changeable
- Metadata remains free key/value

## Event Mapping

- DraftStarted
- FeatureCreated
- FeatureUpdated
- FeatureLocked / FeatureUnlocked
- FeatureDeleted

## Consequences

- consistent UX across geometry types
- easier undo/redo and audit implementation
