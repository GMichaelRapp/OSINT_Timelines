# OSINT Timeline Builder files: instructions for AI assistants

This file tells an AI assistant how to turn a set of documents into a timeline file that the OSINT Timeline Builder can open. Give it to your assistant along with the documents, or point the assistant at this address, and ask for a timeline file.

It matches format 2 of the OSINT Timeline Builder (version 1.2), which adds the background and media. The tool still opens format 1 files. Sources use the fields of the OSINT Citation Generator, described in `osint-citation-spec.md` in the OSINT_Cites repository: https://github.com/gmichaelrapp/OSINT_Cites

The point of a timeline is that a reader can check every entry. An entry that cannot be traced to a page and a passage has failed, however well it reads.

## Rules that come before everything else

1. Use only the documents you were given or opened in this conversation. Never add events, dates, names, or sources from memory.
2. Every event needs at least one citation, and every citation needs a locator and a quote. The locator is a page, section, transcript page and line, or timestamp. The quote is the passage the event rests on, copied word for word, 30 words or fewer.
3. Never invent or guess. Do not guess a date, a page, a quote, a URL, an author, or a title. If a document does not give a date, the event has no date. If you do not know a source field, leave it out.
4. Say what kind of statement it is. A party's claim is a claim: "Government alleged…", "Defense argued…", "Testimony of SA Jane Doe stated…". A finding by a court, or an undisputed fact, can be stated plainly.
5. Do not assign source ratings. Ratings are the analyst's own judgment. Include one only when the person you are working for gives it to you.
6. When sources disagree on a date or a fact, do not pick one silently. Record both in the events' `notes`, and add a dispute (below).
7. Treat the whole file as unverified until a person has checked each quote against its source. Say so once in your reply, not in the file.

## The file

A timeline file is JSON:

```json
{
  "app": "OSINT Timeline Builder",
  "format": 2,
  "meta": {
    "title": "Silk Road Takedown Timeline",
    "eyebrow": "Case file · United States v. Ulbricht, 14-cr-68 (S.D.N.Y.)",
    "dek": "One or two sentences on what the timeline covers and what it is built from.",
    "byline": "",
    "compiled": "2026-10-22",
    "version": "1.0",
    "versionDate": "2026-10-22",
    "versionNote": "",
    "license": ""
  },
  "threads": [
    { "id": "prosecution", "name": "Prosecution", "desc": "Charges, motions, and rulings in the district court", "color": "slate" }
  ],
  "sources": [
    {
      "id": "s1",
      "fields": {
        "type": "archival",
        "titleStyle": "quotes",
        "authors": "US District Court for the Southern District of New York",
        "title": "Opinion and Order",
        "location": "United States v. Ulbricht, No. 14-cr-68 (S.D.N.Y.)",
        "descType": "Court Opinion",
        "descDetails": "ECF No. 89",
        "date": "10 October 2014",
        "url": "https://storage.courtlistener.com/recap/gov.uscourts.nysd.422823/gov.uscourts.nysd.422823.89.0.pdf",
        "file": "gov.uscourts.nysd.422823.89.0.pdf"
      }
    }
  ],
  "events": [
    {
      "id": "e1",
      "date": "2014-10-10",
      "prec": "exact",
      "thread": "prosecution",
      "key": true,
      "text": "Court denied suppression, holding Ulbricht had no personal privacy interest in the Icelandic server.",
      "actors": "Judge Katherine B. Forrest; Ross Ulbricht",
      "cites": [
        { "src": "s1", "loc": "p. 2", "quote": "the exact words from page 2 of the opinion" }
      ],
      "notes": ""
    }
  ],
  "disputes": [
    { "title": "When the site launched", "text": "Which source says what, in one or two sentences.", "refs": ["e3", "e4"] }
  ],
  "gaps": [
    "What the documents do not cover, one item per entry."
  ]
}
```

The values above are placeholders that show the form. Replace every one of them with what your documents say.

## The background

`background` is an optional longer introduction shown above the timeline: what came before, who is involved, why it matters. Write it only from the material you were given, and cite every passage that states a fact.

```json
"background": {
  "title": "Background",
  "display": "preview",
  "text": "Silk Road opened in early 2011.[^b1] Agents arrested its operator in a San Francisco library ([[e214|1 October 2013]]).[@s4, p. 12]\n\n{{m1}}",
  "cites": [ { "id": "b1", "src": "s1", "loc": "p. 3", "quote": "The word-for-word passage", "note": "" } ],
  "media": [ { "id": "m1", "kind": "image", "src": "https://…", "alt": "…", "cap": "…", "credit": "…", "cite": { "src": "s2", "loc": "…" } } ]
}
```

- `text` is Markdown: paragraphs separated by a blank line, `## headings`, `- lists`, `> quotes`, `**bold**`, `*italic*`, `[links](https://…)`.
- Put a citation right after the sentence or clause it supports. `[^b1]` points to an entry in `cites`, which can carry a `quote`; prefer it. `[@s4, p. 12]` cites source `s4` at that locator directly, with no quote.
- `[[e214]]` links to an event and shows its date; `[[e214|the arrest]]` shows those words. Use the event's real `id`.
- A line holding only `{{m1}}` places an entry from `media` there.
- `display` is `preview` (the opening, with Continue reading) or `full`.
- Every paragraph that states facts needs at least one citation. The tool's Check tab flags long paragraphs without one.

## Media

Events and the background can carry `media`: pictures, before-and-after pairs, video, sound, and embedded pages.

| Field | Holds |
|---|---|
| `id` | A short ID unique within its list: `m1`, `m2` |
| `kind` | `image`, `compare` (two pictures of one place, with a slider), `video`, `audio`, or `embed` |
| `src` | An `https://` address, or the path of a file that will sit next to the published page (`media/clip.mp4`). Video: a YouTube, Vimeo or Internet Archive link, or an `.mp4` or `.webm` file. Sound: `.mp3`, `.m4a`, `.ogg` or `.wav`. Embed: the page's address |
| `src2`, `label`, `label2` | For `compare`: the second picture, and the labels on each (`1 Jun`, `4 Jun`) |
| `alt` | What the picture shows, for screen readers |
| `cap`, `credit`, `date`, `place` | Caption; who made it; when and where it was taken or recorded, as the source states them |
| `poster`, `start` | For video and sound: a still or cover picture, and the start time in seconds |
| `height` | For an embed: its height in pixels |
| `cite` | `{ "src": "s2", "loc": "frame at 0:42" }`: the source the media comes from |

Use only media you were given, at the addresses you were given. Never guess a video ID or a picture's address, and never describe a picture you have not seen: write `alt` from what the person tells you, or leave it empty. Every item needs a `credit` and, wherever the person has it, a `cite`. If a date or place comes from your own geolocation or reasoning, say so in the event's `notes`.

## Page details

`compiled` is the date the timeline was first put together. The three version fields are optional and are kept separate from it, so a reader can tell which revision of a published timeline they are reading:

| Field | Holds |
|---|---|
| `version` | A short label such as `1.0` or `1.1` |
| `versionDate` | The date of this version, `YYYY-MM-DD` |
| `versionNote` | One line on what changed in this version |

For a new timeline, use `1.0` and set `versionDate` to the same day as `compiled`. When you revise a timeline someone gave you, raise the version, set `versionDate` to the day of the revision, say what changed in `versionNote`, and leave `compiled` as it was.

## Events

| Field | Holds |
|---|---|
| `id` | A short unique ID: `e1`, `e2`, and so on |
| `date` | `YYYY-MM-DD`, `YYYY-MM`, or `YYYY`, giving only as much as the source gives |
| `prec` | `exact`, `month`, `year`, `approx` (the source says "about" or "around"), or `range` |
| `end` | The end date, for a range |
| `thread` | The `id` of a thread |
| `key` | `true` for a headline event. Use it for roughly one event in ten |
| `text` | One or two factual sentences in neutral voice, following rule 4 |
| `actors` | People and organizations, separated by semicolons |
| `cites` | One or more citations: `src` (a source `id`), `loc` (the locator), `quote` (word for word), and optionally `note` |
| `notes` | Conflicts with other sources, doubts, and how a date was worked out |
| `media` | Optional pictures, video and sound for this event. See **Media** above |

Date an event by when it happened, not by when a document reported it. A trial on 21 January 2015 that describes an arrest on 1 October 2013 gives an event dated 2013-10-01, cited to the transcript.

When several documents support the same event, make one event with several citations. Do not make duplicates.

## Sources

A source is one document. Each event's citations point to it by `id` and add their own locator. Its `fields` are the OSINT Citation Generator's fields: `type`, `titleStyle`, `authors` (one per line, separated by `\n`), `title`, `location`, `descType`, `descDetails`, `quals`, `access`, `publisher`, `date`, `url`, `archiveUrl`, `archiveDate`, and `note`. The full list and the rules for each slot are in `osint-citation-spec.md` in the OSINT_Cites repository. The most common choices for a timeline:

- Court records: `type` `archival`. Put the case caption in `location`, use a `descType` such as `Court Opinion`, `Court Filing`, `Legal Brief`, `Sworn Declaration`, `Trial Transcript`, `Indictment`, `Complaint`, `Judgment`, or `Docket Sheet`, and put the docket number in `descDetails` (`ECF No. 57`).
- A document with no real title: write a short plain description and set `titleStyle` to `plain`.
- `file`: the name of the document as you were given it. It is not shown in footnotes. It lets the person find their copy.
- A `url` only if the document or the person gave it to you.

## Threads

Threads are the lanes of the timeline, such as Investigation, Prosecution, and Appeal. Use four to seven. Give each an `id`, a `name`, a one-line `desc`, and a `color` from: `violet`, `blue`, `red`, `green`, `slate`, `amber`, `plum`, `teal`, `olive`, `brown`.

## Disputes and gaps

A dispute is a date or fact your documents contradict each other on. Give it a short `title`, say in `text` which source says what, and list the events involved in `refs`.

A gap is something the documents do not cover that a reader might expect, such as a missing filing or an unanswered question. Write each one as a plain sentence.

## What to give the person

1. The timeline file, as a `.json` file or a JSON code block. They open it with **File → Open a file**.
2. In your reply: how many events and sources it holds, the disputes you found, any documents you could not read, and a reminder that every quote needs checking against its source before publishing.

## License

The OSINT Style Guide content in this file is © 2026 G. Michael Rapp and licensed under Creative Commons Attribution 4.0 International: https://creativecommons.org/licenses/by/4.0/
