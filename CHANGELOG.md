# Changelog

Changes to the OSINT Timeline Builder, newest first.

## 1.1 — 25 October 2026

- **Version tag:** each timeline can carry a version label, a version date, and a one-line note on what changed, kept separate from the compiled date. The tag shows beside the title and in the footer of the viewer and of exported pages, with the note shown when a reader points at the tag. Set it under **Edit → Page**; a **Today** button fills in the version date.
- Files saved by 1.0 open unchanged; the version fields are optional. The file format stays at 1.
- `timeline-spec.md` tells AI assistants how to fill in and raise the version.

## 1.0 — 22 October 2026

First release.

- **View:** an overview chart by thread, a dated ledger, search, thread and headline filters, a source-rating filter, disputes, gaps, and light and dark themes.
- **Edit:** events, sources, threads, disputes and gaps, and page settings, plus a Check tab that lists every problem across the timeline.
- **Footnotes:** built by the OSINT Citation Generator's own formatter (v3.2.1), following version 1.5 of the OSINT Style Guide.
- **Opens:** timeline files, CSV event lists, and Citation Generator source lists.
- **Exports:** a publishable single-file page, a CSV event list, a Citation Generator source list, and Markdown footnotes.
- Timeline file format 1.
- `timeline-spec.md`: instructions for AI assistants that write timeline files.
- Example: the Silk Road investigation and prosecution, 321 events from *United States v. Ulbricht*.
