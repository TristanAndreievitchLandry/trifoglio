# Migration Issues (Issue-Ready)

This file provides issue-ready tickets derived from the migration backlog.

## Label Conventions

- type:architecture
- type:refactor
- type:documentation
- priority:P0 | priority:P1 | priority:P2
- phase:0..6

## Ticket Template

Title:

Summary:

Scope:

Out of scope:

Dependencies:

Acceptance criteria:

Evidence:

## Phase 0 - Stabilization

### TRI-ARCH-001 - Freeze Migration Scope

Labels: type:architecture, priority:P0, phase:0

Summary:
Define and approve migration boundaries, constraints, and non-goals.

Scope:

- confirm migration objective and compatibility constraints
- confirm no big-bang rewrite policy
- confirm architectural checkpoints

Out of scope:

- implementation changes

Dependencies:

- none

Acceptance criteria:

- scope statement approved
- constraints and non-goals documented

Evidence:

- architecture note or ADR update link

### TRI-ARCH-002 - Document Core User Flows

Labels: type:documentation, priority:P0, phase:0

Summary:
Capture baseline end-to-end flows to protect behavior during migration.

Scope:

- load manifest
- switch canvas
- create/edit/delete feature
- save/export

Out of scope:

- refactor work

Dependencies:

- TRI-ARCH-001

Acceptance criteria:

- flow matrix published
- each flow has entry point, mutations, outputs

Evidence:

- flow matrix link

### TRI-ARCH-003 - Build Mutation Map

Labels: type:architecture, priority:P0, phase:0

Summary:
Identify all project state mutation points.

Scope:

- catalog mutation points by file/module
- classify mutation type

Out of scope:

- rewriting mutation logic

Dependencies:

- TRI-ARCH-002

Acceptance criteria:

- mutation map complete for core flows

Evidence:

- mutation map link

### TRI-ARCH-004 - Baseline Regression Checklist

Labels: type:documentation, priority:P0, phase:0

Summary:
Create repeatable no-regression checklist.

Scope:

- scenario list
- expected outcomes
- run protocol

Out of scope:

- test automation framework migration

Dependencies:

- TRI-ARCH-002

Acceptance criteria:

- checklist executable by another contributor

Evidence:

- checklist link

## Phase 1 - Domain and Event Foundations

### TRI-ARCH-005 - Define Domain Adapter Boundary

Labels: type:architecture, priority:P0, phase:1

Summary:
Define boundary between legacy runtime state and canonical model.

Scope:

- mapping rules to Project/Layer/Feature
- ownership of transformation logic

Out of scope:

- module extraction

Dependencies:

- TRI-ARCH-003

Acceptance criteria:

- adapter spec approved

Evidence:

- adapter spec link

### TRI-ARCH-006 - Establish Canonical ID Policy

Labels: type:architecture, priority:P0, phase:1

Summary:
Define stable identity policy for Project, Layer and Feature.

Scope:

- ID generation strategy
- persistence and reload stability rules

Out of scope:

- storage backend changes

Dependencies:

- TRI-ARCH-005

Acceptance criteria:

- deterministic ID rules documented

Evidence:

- ID policy link

### TRI-ARCH-007 - Enforce Event Envelope Contract

Labels: type:architecture, priority:P0, phase:1

Summary:
Apply event envelope requirements from event contract.

Scope:

- required envelope fields
- validation strategy

Out of scope:

- full event coverage for all mutations

Dependencies:

- TRI-ARCH-005

Acceptance criteria:

- required envelope fields present on emitted events

Evidence:

- event validation report link

### TRI-ARCH-008 - Add Event Emission Coverage Matrix

Labels: type:architecture, priority:P1, phase:1

Summary:
Track and complete canonical event emission for core mutations.

Scope:

- create/update/delete/save/load coverage

Out of scope:

- plugin event coverage

Dependencies:

- TRI-ARCH-007

Acceptance criteria:

- coverage matrix published and complete for core flows

Evidence:

- coverage matrix link

## Phase 2 - Module Extraction

### TRI-ARCH-009 - Extract Viewer Module Boundary

Labels: type:refactor, priority:P0, phase:2

Summary:
Isolate Leaflet/Leaflet-IIIF usage behind Viewer API.

Scope:

- map init
- raster layer control
- viewport synchronization

Out of scope:

- domain decision logic

Dependencies:

- TRI-ARCH-008

Acceptance criteria:

- caller code uses Viewer API, not Leaflet internals directly

Evidence:

- module API doc + PR link

### TRI-ARCH-010 - Extract IIIF Document Module

Labels: type:refactor, priority:P0, phase:2

Summary:
Isolate manifest parsing and canvas/service discovery.

Scope:

- manifest load and normalize
- canvas and service resolution

Out of scope:

- UI interaction logic

Dependencies:

- TRI-ARCH-009

Acceptance criteria:

- IIIF parsing no longer spread across orchestration code

Evidence:

- module API doc + PR link

### TRI-ARCH-011 - Extract Feature Module

Labels: type:refactor, priority:P1, phase:2

Summary:
Centralize Feature lifecycle operations.

Scope:

- create/edit/delete/select
- property/style updates

Out of scope:

- plugin-specific behavior

Dependencies:

- TRI-ARCH-009

Acceptance criteria:

- feature operations routed via Feature service

Evidence:

- module API doc + PR link

### TRI-ARCH-012 - Extract Layer Module

Labels: type:refactor, priority:P1, phase:2

Summary:
Centralize layer lifecycle and behavior.

Scope:

- create/rename/delete
- order/visibility/lock/color

Out of scope:

- Feature business rules

Dependencies:

- TRI-ARCH-011

Acceptance criteria:

- layer operations routed via Layer service

Evidence:

- module API doc + PR link

### TRI-ARCH-013 - Extract Storage Module

Labels: type:refactor, priority:P1, phase:2

Summary:
Centralize persistence calls and serialization.

Scope:

- storage provider interface
- project read/write boundary

Out of scope:

- remote sync protocol

Dependencies:

- TRI-ARCH-005

Acceptance criteria:

- no direct UI persistence access remains

Evidence:

- storage interface doc + PR link

## Phase 3 - Persistence and Lifecycle

### TRI-ARCH-014 - Implement Project Lifecycle State Machine

Labels: type:architecture, priority:P0, phase:3

Summary:
Formalize deterministic lifecycle transitions.

Scope:

- initialize/load/hydrate/active/save/close transitions

Out of scope:

- plugin lifecycle

Dependencies:

- TRI-ARCH-010, TRI-ARCH-011, TRI-ARCH-012, TRI-ARCH-013

Acceptance criteria:

- transition table complete and validated on core flows

Evidence:

- state machine document + PR link

### TRI-ARCH-015 - Align Snapshot Format to Project Model V1

Labels: type:refactor, priority:P0, phase:3

Summary:
Persist project snapshots aligned with canonical schema.

Scope:

- modelVersion management
- required field compliance

Out of scope:

- multi-project sync

Dependencies:

- TRI-ARCH-014

Acceptance criteria:

- persisted snapshot conforms to PROJECT-MODEL-V1

Evidence:

- validation report + PR link

### TRI-ARCH-016 - Add Legacy Snapshot Migration Path

Labels: type:refactor, priority:P0, phase:3

Summary:
Provide deterministic migration from pre-V1 data.

Scope:

- migration rules
- fallback/rejection strategy with clear errors

Out of scope:

- migration of third-party plugin data

Dependencies:

- TRI-ARCH-015

Acceptance criteria:

- old snapshots migrate successfully or fail with explicit reason

Evidence:

- migration test report + PR link

### TRI-ARCH-017 - Harden Autosave Reliability

Labels: type:refactor, priority:P1, phase:3

Summary:
Stabilize autosave under high-frequency edits.

Scope:

- debouncing/throttling policy
- failure and retry behavior

Out of scope:

- collaborative conflict resolution

Dependencies:

- TRI-ARCH-014, TRI-ARCH-015

Acceptance criteria:

- autosave passes stress scenarios in checklist

Evidence:

- scenario results + PR link

## Phase 4 - UI Decoupling

### TRI-ARCH-018 - Introduce UI Command Map

Labels: type:architecture, priority:P1, phase:4

Summary:
Route business actions through command handlers.

Scope:

- map UI intents to app core commands

Out of scope:

- UI redesign

Dependencies:

- TRI-ARCH-011, TRI-ARCH-012, TRI-ARCH-014

Acceptance criteria:

- command map published and used by core actions

Evidence:

- command map + PR link

### TRI-ARCH-019 - Introduce View Model Mapping

Labels: type:architecture, priority:P1, phase:4

Summary:
Map domain state to UI rendering state.

Scope:

- view model adapter specification

Out of scope:

- framework migration

Dependencies:

- TRI-ARCH-018

Acceptance criteria:

- UI consumes mapped state adapter for core screens

Evidence:

- view model doc + PR link

### TRI-ARCH-020 - Remove Remaining UI-to-Storage Coupling

Labels: type:refactor, priority:P1, phase:4

Summary:
Ensure persistence access happens only through services.

Scope:

- coupling audit
- final call-site cleanup

Out of scope:

- backend replacement

Dependencies:

- TRI-ARCH-013, TRI-ARCH-018

Acceptance criteria:

- no direct storage access from UI layer

Evidence:

- coupling audit + PR link

## Phase 5 - Extension Enablement

### TRI-ARCH-021 - Define Plugin Manifest Contract

Labels: type:architecture, priority:P2, phase:5

Summary:
Define plugin registration metadata and lifecycle.

Scope:

- plugin identity/version/capabilities
- validation at load time

Out of scope:

- external marketplace

Dependencies:

- TRI-ARCH-007, TRI-ARCH-011, TRI-ARCH-012

Acceptance criteria:

- manifest contract documented and validated for sample plugin

Evidence:

- contract doc + prototype PR link

### TRI-ARCH-022 - Add Metadata Profile Extension Point

Labels: type:architecture, priority:P2, phase:5

Summary:
Support external metadata profile and validation rules.

Scope:

- registration point
- runtime validation hook

Out of scope:

- domain-specific hardcoding

Dependencies:

- TRI-ARCH-021

Acceptance criteria:

- at least one alternate metadata profile can be loaded

Evidence:

- profile demo + PR link

### TRI-ARCH-023 - Add Import/Export Connector Extension Point

Labels: type:architecture, priority:P2, phase:5

Summary:
Enable additional connectors for data formats.

Scope:

- connector interface
- adapter registration mechanism

Out of scope:

- full support for all target formats

Dependencies:

- TRI-ARCH-021

Acceptance criteria:

- one non-default connector prototype runs end-to-end

Evidence:

- connector demo + PR link

## Phase 6 - Legacy Decommission

### TRI-ARCH-024 - Run Deprecated Path Audit

Labels: type:architecture, priority:P1, phase:6

Summary:
Identify legacy paths still used by critical workflows.

Scope:

- audit of critical paths
- risk classification

Out of scope:

- immediate removal

Dependencies:

- TRI-ARCH-017, TRI-ARCH-020

Acceptance criteria:

- decommission checklist complete

Evidence:

- audit report link

### TRI-ARCH-025 - Remove Obsolete Code Paths

Labels: type:refactor, priority:P1, phase:6

Summary:
Remove deprecated branches no longer needed.

Scope:

- dead code removal
- fallback cleanup

Out of scope:

- new features

Dependencies:

- TRI-ARCH-024

Acceptance criteria:

- no critical flow depends on removed legacy code

Evidence:

- cleanup PR + checklist link

### TRI-ARCH-026 - Perform Architecture Conformance Review

Labels: type:architecture, priority:P1, phase:6

Summary:
Validate final implementation against ADRs, contracts and schema.

Scope:

- conformance matrix
- deviation assessment

Out of scope:

- post-migration roadmap

Dependencies:

- TRI-ARCH-025

Acceptance criteria:

- no high-severity divergence remains

Evidence:

- conformance report link
