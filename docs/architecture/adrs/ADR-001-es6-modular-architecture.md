# ADR-001: ES6 Modular Architecture

## Status

Accepted

## Context

Trifoglio is evolving into a generic platform for annotating IIIF-compatible documents. The current codebase must remain compatible with Leaflet, Leaflet Draw and Leaflet-IIIF while reducing coupling.

## Decision

Adopt a modular ES6 architecture with explicit module boundaries:

- UI Shell
- Application Core
- Domain Modules (Project, Document, Feature, Layer, Metadata, Style)
- Infrastructure Modules (Viewer adapters, Storage, Import/Export)
- Plugin Module
- Event Bus as communication backbone

## Consequences

### Positive

- Better maintainability and testability
- Clear separation between business rules and rendering infrastructure
- Easier migration path from current implementation to a scalable platform

### Negative

- Initial refactoring overhead
- Need strict governance on cross-module dependencies

## Constraints

- No business logic in UI components
- No direct UI access to persistence
- Infrastructure modules cannot define domain truth
