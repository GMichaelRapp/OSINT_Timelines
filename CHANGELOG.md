# Changelog

Changes to the OSINT Timeline Builder, newest first.

## 1.2 — 26 October 2026

- **Background.** A longer introduction above the timeline, written in Markdown with headings, lists, quotes and links. Long backgrounds open with their first lines and a **Continue reading** button; a setting shows all of it.
- **Sources linked to the passage.** Each passage carries a numbered note. Pressing the number shows the full OSINT Style Guide footnote and the quoted passage beside it. The notes are listed under the text, each with a link back to every passage that cites it. A citation used twice keeps one number.
- **Links to events.** Words in the background can link to an event; pressing one jumps to it in the timeline.
- **Media.** Events and the background can carry pictures, before-and-after sliders, video (YouTube, Vimeo, the Internet Archive, or a video file), sound files, and embedded pages (Datawrapper, Flourish, Spotify, SoundCloud, Google Maps, published Google Sheets, Docs and Slides). Each has its own caption, credit, date, place and source. Pictures enlarge when pressed, and the arrow keys step through an event's pictures.
- Videos and embedded pages wait as a plain box until a reader presses play, so nothing loads from the other site before that. YouTube plays through its no-cookie address. Embedded pages run in a sandboxed frame.
- Media can be a file that sits next to the published page (`media/clip.mp4`). While editing, a copy on your computer plays in its place; the export lists the files to upload.
- **Edit → Background:** the text with a live preview, and buttons to cite a source at the cursor, link an event, and insert a picture or video.
- A **With pictures or video** filter in View.
- **Check** flags background paragraphs with no citation, notes and links that point nowhere, citations never placed in the text, media with no source or no description, video links the tool cannot play, and files that must sit next to the page.
- Timeline file format 2: `background`, and `media` on events. Files from 1.0 and 1.1 open as they are. `timeline-spec.md` covers the new fields.

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
