# VBA Macro Review: Auto-Launching UserForms

## Macro contents
```vb
Option Explicit

Private Sub Document_New()
    KELLE_KESEL.Show
End Sub

Private Sub Document_Open()
    KELLE_KESEL.Show
End Sub

Private Sub Start_Click()
    KelleB.Show
End Sub
```

## Behavior summary
- The macro runs on both **Document_New** and **Document_Open**, so the `KELLE_KESEL` user form is displayed automatically whenever the document is created or opened.
- The `Start_Click` handler opens another user form named `KelleB` when triggered.
- No file I/O, network calls, or registry edits are present in this snippet; the immediate effect is UI-only form display.

## Risk assessment
- Auto-launching user forms on open can be used for social engineering (e.g., prompting users for credentials or enticing them to enable additional code). Without seeing the form definitions, the intent is unclear.
- Even though the shown code lacks overtly malicious actions, any macro that executes on open should be treated cautiously until its forms and any called code are inspected.

## Recommended vetting steps
1. Inspect the `KELLE_KESEL` and `KelleB` form definitions for embedded logic (buttons, hidden event handlers, or injected modules).
2. Check for additional modules in the document template that might be invoked by the forms (e.g., through button click handlers or timers).
3. Open the document in a sandboxed environment and monitor for filesystem, process, or network activity when the forms are interacted with.
4. If the document is not expected to contain macros, remove the VBA project or rebuild the content into a macro-free template.

## Verdict
Treat this macro as **potentially suspicious** because it triggers code on open and relies on user forms whose intent is unknown. Proceed only after reviewing the associated form code and validating that the document originates from a trusted source.
