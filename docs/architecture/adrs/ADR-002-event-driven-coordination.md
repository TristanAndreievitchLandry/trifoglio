# ADR-002: Event-Driven Coordination

## Status

Accepted

## Context

Domain services must remain decoupled while reacting to user actions and infrastructure outcomes (IIIF load, drawing changes, persistence).

## Decision

Use an internal Event Bus for module coordination.

Each module:

- publishes events when state changes
- subscribes only to events it needs
- avoids direct cross-calls when event semantics are sufficient

## Event Contracts

All events must include:

- eventId
- eventType
- projectId
- timestamp
- payload
- sourceModule

## Canonical Event Families

- ProjectCreated, ProjectOpened, ProjectSaved, ProjectClosed
- ManifestLoadRequested, ManifestLoaded, ManifestLoadFailed, CanvasChanged
- FeatureCreateRequested, FeatureCreated, FeatureUpdated, FeatureDeleted
- LayerCreated, LayerUpdated, LayerDeleted, LayerOrderChanged
- AutosaveRequested, AutosaveCompleted, PersistenceFailed
- PluginLoaded, PluginActionRequested, PluginActionCompleted, PluginError

## Consequences

### Positive

- Loose coupling and better extensibility
- Event log can later support audit, replay or collaboration

### Negative

- Requires event schema governance
- Debugging can be harder without tooling
