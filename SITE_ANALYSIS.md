# RSNA MRI report studio — site analysis (actionable)

This note reflects the current codebase state and concrete gaps to fix in the single-page Turkmen RSNA/022 MRI report tool.

## Verified behavior (current)
- **Schema-driven form:** `schema.js` provides sections/fields (general, flow, structures, result, advice) that `renderForm.js` maps into inputs with Turkmen labels. Layout uses the CSS grid in `styles.css`.
- **Profile defaults:** `app.js` renders a profile `<select>` powered by `profiles.js` and applies `defaults` via `applyProfileDefaults()` on change.
- **State + autosave:** `state.js` keeps a flat `reportState` object; `storage.js` saves/loads it from `localStorage` in `init()` and through `reportState.subscribe`.
- **Preview generation:** `report.js` traverses `SECTIONS` to compose a Turkmen plain-text report; empty fields are skipped. Preview stays hidden until the user clicks **Hasabat döret**.
- **DOCX export stub:** `exportToDocx.js` is wired to the button but only logs a placeholder string.

## Key gaps to fix
1. **Patient/exam metadata missing** — No dedicated fields for patient name, age, gender, ID, or exam date; reports lack a header block. (`schema.js`, `renderForm.js`, `report.js`, `storage.js`)
2. **Profile UX feedback** — The profile picker has no description or safeguard before overwriting filled fields; users don’t see what each profile does. (`app.js`, `styles.css`, `profiles.js`)
3. **Initial state shape** — `reportState` starts as an untyped `{}`. There is no canonical default schema, making render/export assumptions brittle and hurting hydration clarity. (`state.js`, `storage.js`, `schema.js`)
4. **DOCX export not implemented** — The export path calls a stub; no template bindings exist even though template assets are present. (`exportToDocx.js`, DOCX template files)
5. **Validation and empty-state cues** — The UI doesn’t highlight missing required basics or indicate that the preview is empty until generation. (`app.js`, `renderForm.js`, `styles.css`)

## Recommended next actions (concrete)
- **Add patient/exam block**: extend `SECTIONS` with patient metadata, render inputs, bind to state/storage, and include in preview/export.
- **Enrich profile picker**: show description text per profile; add a confirmation modal before applying defaults when the form already has data.
- **Define default state**: introduce an initial schema/object for all fields to avoid undefined values and simplify hydration and validation.
- **Implement DOCX export**: wire `exportToDocx.js` to docxtemplater with the existing template, mapping current field keys to placeholders.
- **Surface validation cues**: inline “required” hints for core patient/protocol fields and a passive preview placeholder when no report is generated.
