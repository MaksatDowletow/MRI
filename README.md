# MRI

## Overview
Static single-page RSNA MRI report studio built for GitHub Pages with vanilla HTML/CSS/JS and ES modules. The app renders a schema-driven form for RSNA/022 brain MRI reports, supports clinical profile presets, autosaves drafts to `localStorage`, and generates Turkmen-language plain-text reports for quick copy/paste or future DOCX export.

## Architecture
- `index.html` – Page shell (header/main/footer), mounts the form into `#app` and shows preview in `#reportPreview`.
- `styles.css` – Base layout and card styling for form sections and preview.
- `app.js` – Entry point; initializes state from localStorage, renders the UI shell, attaches event handlers, and wires buttons for generate/clear/export.
- `schema.js` – Declarative RSNA/022 section and field definitions (ids, labels, input types, options) + `createEmptyReportState()` helper.
- `profiles.js` – Clinical profile presets (kadaly, dyscirculatory, postoperative) with default field values.
- `state.js` – Lightweight observable store for `reportState` with `init`, `setField`, dirtiness check, and subscriptions.
- `renderForm.js` – Renders form sections based on `schema.js`, binds input events to `reportState` updates.
- `report.js` – Assembles Turkmen plain-text report blocks per section, skipping empty fields; exports reusable blocks for previews/exports.
- `storage.js` – Draft persistence helpers for autosave/restore via `localStorage`.
- `i18n.js` – Minimal translation helper for UI labels (TM-first, extensible to RU/EN).
- `exportDocx.js` – Generates a Word-compatible `.doc` download from the structured report.

## Usage
Open `index.html` on GitHub Pages or a static server. Select a clinical profile to prefill defaults, complete the generated form, and click **Hasabat döret** to view the structured text in the preview panel. Drafts save automatically between sessions; **Arassala / täzele** clears state and storage. DOCX export is stubbed until docxtemplater wiring is added.
