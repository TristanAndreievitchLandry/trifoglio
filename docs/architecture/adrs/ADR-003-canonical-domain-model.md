# ADR-003: Canonical Domain Model

## Status

Accepted

## Context

Trifoglio must remain discipline-agnostic and handle heterogeneous IIIF use cases. A stable domain model is required before adding advanced workflows.

## Decision

Define the following business entities as canonical:

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

## Model Principles

- Feature properties are geometry-agnostic
- Layer is a logical grouping with no business logic
- Metadata is free key/value without semantic assumptions
- Viewer state is part of project state but distinct from domain data

## Identity Rules

- Every Project, Layer and Feature has a stable ID
- Feature ID remains stable across geometry edits
- CanvasRef ID follows source IIIF identity when available

## Versioning

- Project carries a modelVersion
- Storage module performs explicit migrations on load

## Consequences

### Positive

- Shared language across modules and plugins
- Safer import/export mapping

### Negative

- Requires migration policy whenever canonical model changes
