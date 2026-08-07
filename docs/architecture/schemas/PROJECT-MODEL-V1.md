# Project Model V1

This document defines the canonical Trifoglio domain model for Project, Layer and Feature.

## Principles

- Feature properties are geometry-agnostic.
- Layer contains no business logic.
- Metadata is free key/value with optional hints.
- Viewer state is persisted as project context, separate from domain entities.

## Root Object: Project

Required fields:

- id: string
- modelVersion: string (example: "1.0.0")
- name: string
- iiifDocument: IiifDocument
- viewerState: ViewerState
- layers: Layer[]
- features: Feature[]
- preferences: ProjectPreferences
- createdAt: string (ISO-8601)
- updatedAt: string (ISO-8601)

Optional fields:

- attachments: Attachment[]
- tags: string[]
- extensions: object

## IiifDocument

Required fields:

- manifestUrl: string
- manifestId: string
- canvases: CanvasRef[]
- activeCanvasId: string

Optional fields:

- provider: string
- attribution: string
- thumbnailUrl: string

## CanvasRef

Required fields:

- id: string
- label: string
- index: number

Optional fields:

- iiifServiceUrl: string

## Layer

Required fields:

- id: string
- name: string
- order: number
- visible: boolean
- locked: boolean
- color: string
- featureIds: string[]

Optional fields:

- styleRef: string
- metadata: MetadataEntry[]
- extensions: object

## Feature

Required fields:

- id: string
- layerId: string
- geometryType: string
- geometry: object
- properties: FeatureProperties
- style: FeatureStyle
- tags: string[]
- popup: FeaturePopup
- createdAt: string (ISO-8601)
- updatedAt: string (ISO-8601)

Optional fields:

- status: string (active | locked | deleted)
- attachments: Attachment[]
- extensions: object

## FeatureProperties

Required fields:

- title: string
- description: string
- category: string
- customMetadata: MetadataEntry[]

## MetadataEntry

Required fields:

- key: string
- value: string

Optional fields:

- typeHint: string
- namespace: string

## FeatureStyle

Required fields:

- strokeColor: string
- strokeWidth: number
- strokeOpacity: number
- fillColor: string
- fillOpacity: number

Optional fields:

- markerIcon: string
- markerSize: number
- zIndex: number

## FeaturePopup

Required fields:

- enabled: boolean
- template: string

Optional fields:

- sanitizedHtml: string

## ViewerState

Required fields:

- activeCanvasId: string
- zoom: number
- center: { lat: number, lng: number }
- basemapStyle: string

Optional fields:

- selectedFeatureId: string
- uiFlags: object

## ProjectPreferences

Required fields:

- language: string
- autosaveEnabled: boolean
- autosaveIntervalMs: number

Optional fields:

- displayOptions: object
- interactionOptions: object

## Attachment (Future)

Required fields:

- id: string
- featureId: string
- uri: string
- mimeType: string

Optional fields:

- name: string
- metadata: MetadataEntry[]

## Invariants

- Every feature.layerId must reference an existing layer.id.
- Every layer.featureIds entry must reference an existing feature.id.
- Feature IDs are stable across geometry edits.
- Project.updatedAt changes on every persistent mutation.

## Versioning and Migration

- modelVersion is mandatory.
- Storage module must migrate older snapshots before hydration.
- Migrations must be deterministic and side-effect free.
