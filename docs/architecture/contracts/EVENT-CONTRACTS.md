# Event Contracts

This document defines canonical event contracts for Trifoglio.

## Envelope

All events use a shared envelope.

- eventId: unique event identifier (UUID)
- eventType: canonical event name
- projectId: target project ID
- occurredAt: ISO-8601 timestamp
- sourceModule: emitter module name
- correlationId: request/command correlation ID
- causationId: upstream event ID (optional)
- version: event schema version
- payload: event-specific data

## Conventions

- Event names use PascalCase.
- Payload keys use camelCase.
- Events are immutable after publication.
- Consumers must ignore unknown payload fields for forward compatibility.

## Project Events

### ProjectCreated

- payload.name
- payload.modelVersion
- payload.preferences

### ProjectOpened

- payload.storageProvider
- payload.snapshotVersion

### ProjectSaved

- payload.reason (manual | autosave | checkpoint)
- payload.snapshotId

### ProjectClosed

- payload.reason (user-request | shutdown)

### ProjectStateChanged

- payload.previousState
- payload.nextState

## IIIF Document Events

### ManifestLoadRequested

- payload.manifestUrl
- payload.requestedCanvasId (optional)

### ManifestLoaded

- payload.manifestId
- payload.canvasCount
- payload.defaultCanvasId
- payload.provider (optional)

### ManifestLoadFailed

- payload.manifestUrl
- payload.errorCode
- payload.errorMessage
- payload.httpStatus (optional)

### CanvasChanged

- payload.previousCanvasId (optional)
- payload.currentCanvasId
- payload.reason (initial | user-navigation | deep-link)

### IiifLayerReady

- payload.canvasId
- payload.iiifServiceUrl

## Feature Events

### FeatureCreateRequested

- payload.layerId
- payload.geometryType
- payload.geometry

### FeatureCreated

- payload.featureId
- payload.layerId
- payload.geometryType
- payload.geometry
- payload.properties
- payload.style

### FeatureUpdated

- payload.featureId
- payload.changedFields
- payload.patch

### FeatureDeleted

- payload.featureId
- payload.layerId
- payload.mode (soft | hard)

### FeatureSelected

- payload.featureId

### FeatureDeselected

- payload.featureId

### FeatureMetadataChanged

- payload.featureId
- payload.metadataPatch

### FeatureStyleChanged

- payload.featureId
- payload.stylePatch

## Layer Events

### LayerCreated

- payload.layerId
- payload.name
- payload.order

### LayerRenamed

- payload.layerId
- payload.previousName
- payload.nextName

### LayerVisibilityChanged

- payload.layerId
- payload.visible

### LayerLocked

- payload.layerId
- payload.locked

### LayerOrderChanged

- payload.layerId
- payload.previousOrder
- payload.nextOrder

### LayerDeleted

- payload.layerId

## Persistence Events

### AutosaveRequested

- payload.trigger (timer | mutation-threshold | before-unload)

### AutosaveCompleted

- payload.snapshotId
- payload.durationMs

### PersistenceFailed

- payload.operation (save | load | migrate)
- payload.errorCode
- payload.errorMessage

## Plugin Events

### PluginLoaded

- payload.pluginId
- payload.pluginVersion

### PluginActionRequested

- payload.pluginId
- payload.actionName
- payload.actionInput

### PluginActionCompleted

- payload.pluginId
- payload.actionName
- payload.resultSummary

### PluginError

- payload.pluginId
- payload.actionName (optional)
- payload.errorCode
- payload.errorMessage

## Delivery Guarantees

- Publication order is guaranteed per project scope.
- Handlers must be idempotent for retries.
- Persistence-critical handlers should implement exactly-once effects at storage boundary.

## Validation Rules

- Unknown eventType must be rejected by producer tests.
- Missing envelope fields fail fast.
- payload is validated against per-event schemas.
