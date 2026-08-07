# ADR-004: Project Lifecycle

## Status

Accepted

## Context

The platform needs a deterministic lifecycle for opening, editing and saving work across IIIF document sessions.

## Decision

Adopt a six-phase project lifecycle:

1. Initialize
2. Load IIIF Document
3. Hydrate Workspace
4. Active Session
5. Save and Export
6. Close and Release

## Detailed Phases

### 1) Initialize

- create new project or open existing one
- set base preferences

### 2) Load IIIF Document

- validate manifest URL
- fetch and parse manifest
- resolve canvases and initial canvas

### 3) Hydrate Workspace

- restore layers/features/preferences from storage
- bind viewer state to domain state

### 4) Active Session

- perform feature/layer operations
- emit domain events
- run autosave policy

### 5) Save and Export

- persist canonical project state
- export selected formats

### 6) Close and Release

- flush pending writes
- release viewer resources
- emit project closed event

## Consequences

- predictable state transitions
- easier recovery and migration logic
