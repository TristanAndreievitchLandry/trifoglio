# Module Contracts

This document defines the scaffold-level public contracts for each module.

## Conventions

- All modules are ES6 classes.
- Methods listed below are public API boundaries.
- Methods are intentionally behavior-free at scaffold stage.
- Emitted events follow the EventBus contract.
- Feature is the canonical domain term.
- Annotation remains a legacy implementation term in some current module names and method names.

## ProjectManager

Public methods:

- initialize
- createProject
- openProject
- saveProject
- closeProject
- setActiveProject
- getActiveProject
- exportSnapshot
- importSnapshot
- destroy

Emitted events:

- project:created
- project:opened
- project:saved
- project:closed
- project:stateChanged

## ViewerManager

Public methods:

- initialize
- attachMap
- loadManifest
- setCanvas
- setBasemapStyle
- getViewerState
- applyViewerState
- clearDocument
- destroy

Emitted events:

- viewer:initialized
- viewer:manifestLoaded
- viewer:canvasChanged
- viewer:stateChanged

## Feature Manager

Current implementation name: AnnotationManager.

Canonical responsibility: manage Feature lifecycle, geometry, properties, and selection.

Public methods:

- initialize
- createFeature (current implementation: createAnnotation)
- updateFeatureGeometry (current implementation: updateAnnotationGeometry)
- updateFeatureProperties (current implementation: updateAnnotationProperties)
- deleteFeature (current implementation: deleteAnnotation)
- selectFeature (current implementation: selectAnnotation)
- clearSelection
- listFeatures (current implementation: listAnnotations)
- attachLayer
- detachLayer
- destroy

Emitted events:

- feature:created
- feature:updated
- feature:deleted
- feature:selected
- feature:deselected

Legacy event naming may still use the annotation:\* prefix in transitional code paths.

## LayerManager

Public methods:

- initialize
- createLayer
- renameLayer
- reorderLayer
- setLayerVisibility
- setLayerLock
- setLayerColor
- addFeature (current implementation: addAnnotation)
- removeFeature (current implementation: removeAnnotation)
- deleteLayer
- listLayers
- destroy

Emitted events:

- layer:created
- layer:renamed
- layer:updated
- layer:deleted
- layer:orderChanged

## SidebarManager

Public methods:

- initialize
- open
- close
- toggle
- renderSections
- updateProjectSummary
- updateLayerTree
- updateSelectionState
- destroy

Emitted events:

- sidebar:opened
- sidebar:closed
- sidebar:sectionChanged

## PopupManager

Public methods:

- initialize
- bindToFeature (current implementation: bindToAnnotation)
- openPopup
- closePopup
- updatePopupContent
- pinPopup
- unpinPopup
- destroy

Emitted events:

- popup:opened
- popup:closed
- popup:updated

## StyleManager

Public methods:

- initialize
- defineStyle
- updateStyle
- deleteStyle
- applyStyleToLayer
- applyStyleToFeature (current implementation: applyStyleToAnnotation)
- resolveEffectiveStyle
- listStyles
- destroy

Emitted events:

- style:created
- style:updated
- style:deleted
- style:applied

## ImportExportManager

Public methods:

- initialize
- importProject
- exportProject
- importFeatures (current implementation: importAnnotations)
- exportFeatures (current implementation: exportAnnotations)
- registerConnector
- unregisterConnector
- listConnectors
- destroy

Emitted events:

- import:started
- import:completed
- export:started
- export:completed
- importExport:error

## HistoryManager

Public methods:

- initialize
- pushAction
- undo
- redo
- canUndo
- canRedo
- clearHistory
- getHistoryState
- destroy

Emitted events:

- history:pushed
- history:undo
- history:redo
- history:cleared

## SearchManager

Public methods:

- initialize
- indexProject
- searchFeatures (current implementation: searchAnnotations)
- searchMetadata
- filterByLayer
- clearFilters
- destroy

Emitted events:

- search:started
- search:completed
- search:filtersChanged

## ContextMenuManager

Public methods:

- initialize
- registerAction
- unregisterAction
- openContextMenu
- closeContextMenu
- setContext
- destroy

Emitted events:

- contextMenu:opened
- contextMenu:closed
- contextMenu:actionRegistered
- contextMenu:actionInvoked

## PropertiesDialog

Public methods:

- initialize
- open
- close
- submit
- reset
- setValidationSchema
- getValues
- setValues
- destroy

Emitted events:

- propertiesDialog:opened
- propertiesDialog:closed
- propertiesDialog:submitted
- propertiesDialog:reset

## Utils

Public methods:

- initialize
- generateId
- deepClone
- debounce
- throttle
- parseJsonSafe
- serializeJsonSafe
- destroy

Emitted events:

- utils:error
