# ADR-006: Extension Strategy

## Status

Accepted

## Context

Trifoglio must support diverse disciplines without hardcoding domain assumptions in core modules.

## Decision

Provide extension points at bounded interfaces:

- drawing tools
- metadata profiles and validators
- import/export connectors
- storage backends
- viewer overlays and interaction tools
- analysis/search services
- collaboration workflows

Extensions interact through:

- stable domain model contracts
- event bus hooks
- plugin registration API (future implementation)

## Non-goals

- plugins modifying internal private state directly
- plugins bypassing validation or persistence policies

## Consequences

### Positive

- long-term scalability across use cases
- safer customization with minimal core changes

### Negative

- governance needed for API stability and compatibility
