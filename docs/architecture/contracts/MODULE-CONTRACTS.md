# Module Contracts

This document defines the scaffold-level public contracts for each module.

## Conventions

- All modules are ES6 classes.
- Methods listed below are public API boundaries.
- Methods are intentionally behavior-free at scaffold stage.
- Emitted events follow the EventBus contract.

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

## AnnotationManager

Public methods:

- initialize
- createAnnotation
- updateAnnotationGeometry
- updateAnnotationProperties
- deleteAnnotation
- selectAnnotation
- clearSelection
- listAnnotations
- attachLayer
- detachLayer
- destroy

Emitted events:

- annotation:created
- annotation:updated
- annotation:deleted
- annotation:selected
- annotation:deselected

## LayerManager

Public methods:

- initialize
- createLayer
- renameLayer
- reorderLayer
- setLayerVisibility
- setLayerLock
- setLayerColor
- addAnnotation
- removeAnnotation
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
- bindToAnnotation
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
- applyStyleToAnnotation
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
- importAnnotations
- exportAnnotations
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
- searchAnnotations
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
