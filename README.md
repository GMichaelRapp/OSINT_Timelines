# OSINT Timeline Builder

A tool for building sourced, filterable timelines and publishing them as a single web page. Every entry carries its citations in the form set out by the [OSINT Style Guide](https://gmichaelrapp.github.io/OSINT_Cites/), so a reader can follow each claim back to the page and passage it rests on.

It is one web page. There is nothing to install, no account, and no server.

## What it makes

A published timeline has:

- an overview chart with one lane per thread and a dot per event, where large dots are headline events
- a dated ledger of events. Each event has its thread, the people involved, and an expandable list of sources. Every source shows as a full footnote with the quoted passage underneath.
- search, thread filters, a headline-only switch, and a filter by source rating once your sources are rated
- a sidebar of **disputes** (dates and facts your sources contradict each other on, linked to the events involved), **gaps** (what your material does not cover), and a key to the threads and ratings
- light and dark themes, and a layout that works on a phone

The Silk Road example in `examples/silk-road.json` shows all of it: 321 events from *United States v. Ulbricht*, cited to 56 court records with page or transcript-line locators.

## Using it

Open `index.html` in any current browser, or use the hosted copy linked in this repository's About box. It opens on a sample timeline.

- **View** shows the timeline as readers will see it.
- **Edit** has six tabs:
  - **Events:** the date, how exact the date is, the thread, a headline switch, what happened, the people and organizations involved, citations, and notes. Each citation picks a source and adds a locator and the quoted passage. The footnote builds as you type.
  - **Sources:** the same fields as the OSINT Citation Generator, including the 771-term description library, qualifiers, access notes, language notes, and an optional Admiralty rating. Its checks appear under the footnote.
  - **Threads:** the name, description, color, and order of each lane.
  - **Disputes & gaps:** what the sources disagree on, and what they don't cover.
  - **Page:** the title, the line above it, the summary, the byline, the date compiled, and the license line.
  - **Check:** every problem across the timeline. It finds events with no citation, citations to missing sources, citations with no locator, disputes pointing nowhere, and every check the Citation Generator would raise on a source.

### Dates

Type a day, a month, or a year, in almost any form: `2013-10-01`, `1 October 2013`, `10/1/2013`, `Oct 2013`, `2013`. Slashes are read as month/day/year. Then say how exact the date is: exact, month only, year only, approximate, or a range with an end date. Events sort by date, and undated events go to the end.

### Ratings

A rating is a letter and a number, such as `B2`. The letter (A to F) rates the reliability of the source and the number (1 to 6) rates the credibility of the information. The pair falls in a zone: green, yellow, orange, red, or gray. Ratings are optional and are always the analyst's own judgment. Once any source has one, the published page offers a filter by zone.

## Files

**File → Save timeline** writes a `.json` file holding everything. **File → Open a file** reads three kinds of file:

| File | What happens |
|---|---|
| A timeline (`.json`) saved from this tool | It replaces the open timeline, after you confirm |
| A source list (`.json`) saved from the [OSINT Citation Generator](https://gmichaelrapp.github.io/OSINT_Cites/) | Its sources are added to the source list |
| Events (`.csv`) | You choose whether to add them to the open timeline or start a new one |

You can also drag a file onto the page.

### The CSV format

One row per citation. Rows that share an `event_id` become one event with several citations.

| Column | Holds |
|---|---|
| `event_id` | Any short ID. Rows with the same ID are one event |
| `date` | A day, month, or year in any common form |
| `precision` | `exact`, `month`, `year`, `approx`, or `range` |
| `end_date` | For a range |
| `thread` | A thread name. New names become new threads |
| `headline` | `yes` for a headline event |
| `event` | What happened, in one or two sentences |
| `actors` | People and organizations, separated by semicolons |
| `notes` | Conflicts, doubts, how a date was worked out |
| `source_id` | The ID of a source in the source list |
| `locator` | Page, section, transcript line, or timestamp |
| `quote` | The passage the event rests on, word for word |

Only `date` and `event` are required. A `source_id` that is not in the source list becomes a placeholder source for you to fill in. A Citation Generator list that uses the same IDs will fill it.

### Exports

| Export | What you get |
|---|---|
| Publishable page (`index.html`) | One file holding the timeline, view only, with a **Get the data** button so readers can download the JSON behind it |
| Events (`.csv`) | One row per citation, in the format above |
| Source list (`.json`) | Opens in the OSINT Citation Generator with every field intact |
| Footnotes (`.md`) | Every source as a full footnote, numbered |

Before exporting a page, the tool lists anything the **Check** tab would mark as a fix.

## Publishing on GitHub Pages

1. Make a new public repository.
2. Upload the exported `index.html`.
3. In **Settings → Pages**, deploy from the `main` branch, `/ (root)`.

The page will be at `https://<your-username>.github.io/<repository>/`. Add `#<event-id>` to the address to link to a single event.

## Using it with an AI assistant

Reading a stack of documents and drawing out dated, sourced events is the slow part. `timeline-spec.md` tells an AI assistant how to write a timeline file this tool can open. It covers which fields to use, how to quote, and what not to invent. Give the assistant the file, or point it at the address, along with your documents. Then open the result here and check it before you publish. Every quote should be checked against its source.

## Your data

The page runs entirely in your browser. It sends nothing anywhere and loads nothing from other sites. Your timeline is kept in the browser's local storage on your device, so it is still there when you come back. Save it to a file to move it or keep it safe. Clearing your browser's site data clears it.

The one request the page makes is **File → Open the Silk Road example**, which reads `examples/silk-road.json` from the same site.

## Tests

`node Tests/run.js` checks dates, file reading, CSV round trips, footnotes, the checks, and the example file. It needs Node 18 or later and nothing else, and it runs on GitHub on every push.

## Credits and license

The citation formatter, the source types, and the description library are taken from the [OSINT Citation Generator](https://github.com/gmichaelrapp/OSINT_Cites) v3.2.1, so footnotes come out the same in both tools.

- Code: MIT License (`LICENSE-MIT`)
- OSINT Style Guide content: the citation rules, description library, and qualifier and access lists, under Creative Commons Attribution 4.0 International (`LICENSE-CC-BY-4.0`)

© 2026 G. Michael Rapp.
