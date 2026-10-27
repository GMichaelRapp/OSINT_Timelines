#!/usr/bin/env node
/*
 * Tests for the OSINT Timeline Builder.
 *
 * Run from the repository root with:  node Tests/run.js
 * Needs Node 18 or later and nothing else. It reads index.html, pulls out the
 * citation formatter, the source tables and the timeline model, and checks that
 * known inputs still give the expected results.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function block(id) {
  const m = html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)</script>'));
  if (!m) { console.error('Could not find <script id="' + id + '"> in index.html'); process.exit(1); }
  return m[1];
}
const [O, T, TL] = new Function(block('core') + block('tables') + block('tl-core') + ';return [OSINT, OSINT_TABLES, TL];')();
const lib = {}; T.LIB.forEach((c) => c.g.forEach((g) => g.i.forEach((x) => { lib[x.toLowerCase()] = {}; })));
O.setLibrary(lib);

let failed = 0, passed = 0;
function eq(got, want, label) {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) { passed++; return; }
  failed++; console.log('FAIL  ' + label + '\n  got : ' + g + '\n  want: ' + w);
}
function ok(cond, label) { eq(!!cond, true, label); }

// ---- 1. Dates ----
[
  ['2013', '2013'], ['2013-10', '2013-10'], ['2013-10-01', '2013-10-01'], ['2013-1-5', '2013-01-05'],
  ['10/1/2013', '2013-10-01'], ['1 October 2013', '2013-10-01'], ['Oct 1, 2013', '2013-10-01'], ['October 2013', '2013-10'],
  ['2013-02-30', ''], ['2012-02-29', '2012-02-29'], ['13/1/2013', ''], ['soon', ''], ['', '']
].forEach(([raw, want]) => eq(TL.normDate(raw), want, 'normDate ' + JSON.stringify(raw)));
eq(TL.showDate('2013-10-01'), '1 Oct 2013', 'showDate day');
eq(TL.showDate('2013-10'), 'Oct 2013', 'showDate month');
eq(TL.showDate(''), 'Undated', 'showDate empty');
eq(TL.precLabel({ date: '2013-10', prec: 'exact' }), 'month', 'precLabel infers month');
eq(TL.precLabel({ date: '2013-10-01', prec: 'range', end: '2013-10-03' }), 'to 3 Oct 2013', 'precLabel range');
ok(TL.sortKey('2011') < TL.sortKey('2011-01-01') && TL.sortKey('2011-06') < TL.sortKey('2011-06-02') && TL.sortKey('') > TL.sortKey('2999'), 'sort order: year, month, day, undated last');

// ---- 2. Reading projects ----
let r = TL.normalize({ events: [{ id: 'a', date: '2013', thread: 'Courts', text: 'x', cites: [] }, { id: 'a', date: 'nope', text: 'y' }] }, T.TEXT_KEYS);
eq(r.project.threads.map((t) => t.name), ['Courts'], 'thread made from a name');
eq(r.project.events.map((e) => e.id), ['a', 'e1'], 'duplicate event ID renamed');
eq(r.fixes.length, 2, 'two repairs reported');
eq(r.project.events[1].thread, r.project.threads[0].id, 'event with no thread gets the first thread');
ok(TL.normalize({ nothing: true }, T.TEXT_KEYS).error, 'a file with no events is refused');

// ---- 2b. Version tag, kept apart from the compiled date ----
r = TL.normalize({ meta: { compiled: '2026-10-22', version: '1.1', versionDate: '2026-10-25', versionNote: 'Added October events' }, events: [] }, T.TEXT_KEYS);
eq([r.project.meta.compiled, r.project.meta.version, r.project.meta.versionDate, r.project.meta.versionNote], ['2026-10-22', '1.1', '2026-10-25', 'Added October events'], 'version fields survive a round trip, separate from compiled');
eq(TL.normalize({ events: [] }, T.TEXT_KEYS).project.meta.version, '', 'files without a version still open');
eq(TL.versionLabel({ version: '1.1', versionDate: '2026-10-25' }), 'Version 1.1 · 25 Oct 2026', 'version label with date');
eq(TL.versionLabel({ version: 'v2.0' }), 'Version 2.0', 'leading v is not doubled');
eq(TL.versionLabel({ version: 'Version 3' }), 'Version 3', 'leading "Version" is not doubled');
eq(TL.versionLabel({ versionDate: 'October 25, 2026' }), 'Version · 25 Oct 2026', 'date-only version');
eq(TL.versionLabel({ version: 'draft 2', versionDate: 'spring' }), 'Version draft 2 · spring', 'free text kept as typed');
eq(TL.versionLabel({ compiled: '2026-10-22' }), '', 'no version tag without version fields');

// ---- 3. Footnotes come from the Citation Generator's formatter ----
const court = { type: 'archival', authors: 'US District Court for the Southern District of New York', title: 'Opinion and Order', titleStyle: 'quotes',
  location: 'United States v. Ulbricht, No. 14-cr-68 (S.D.N.Y.)', descType: 'Court Opinion', descDetails: 'ECF No. 89', date: '2014-10-10',
  url: 'https://storage.courtlistener.com/recap/gov.uscourts.nysd.422823/gov.uscourts.nysd.422823.89.0.pdf', access: [], quals: [] };
eq(O.toMarkdown(O.build(TL.sourceState(O, T.TYPES, T.TEXT_KEYS, court, '5')).seg),
  'US District Court for the Southern District of New York, "Opinion and Order," *United States v. Ulbricht, No. 14-cr-68 (S.D.N.Y.)* [Court Opinion; ECF No. 89] (10 October 2014) https://storage.courtlistener.com/recap/gov.uscourts.nysd.422823/gov.uscourts.nysd.422823.89.0.pdf: p. 5.',
  'court opinion footnote with a page');
const withRating = O.toMarkdown(O.build(TL.sourceState(O, T.TYPES, T.TEXT_KEYS, Object.assign({}, court, { rating: 'B2' }), '25-27')).seg);
ok(withRating.endsWith('.pdf: pp. 25–27.'), 'page range gets pp. and an en dash');
ok(withRating.indexOf('[Court Opinion; ECF No. 89; B2]') !== -1, 'rating goes last in the bracket');

// ---- 4. CSV ----
const csv = 'event_id,date,precision,thread,headline,event,source_id,locator,quote\n' +
  'x1,2014-02-04,exact,Pretrial,yes,"Indicted, on four counts",s1,p. 1,"a ""quoted"" line"\n' +
  'x1,,,,,,s2,p. 2,\n' +
  'x2,March 2015,,Trial,,Second event,,,\n';
r = TL.fromCSV(csv, TL.blank());
let p = TL.normalize(r.raw, T.TEXT_KEYS).project;
eq(p.events.length, 2, 'CSV rows sharing an event_id make one event');
eq(p.events[0].cites.map((c) => c.src), ['s1', 's2'], 'CSV citations kept in order');
eq(p.events[0].cites[0].quote, 'a "quoted" line', 'CSV quotes unescaped');
eq(p.events[0].key, true, 'CSV headline yes');
eq(p.events[1].date, '2015-03', 'CSV month date read');
eq(r.placeholders, ['s1', 's2'], 'unknown source IDs become placeholders');
ok(TL.fromCSV('a,b\n1,2', TL.blank()).error, 'CSV without date and event columns is refused');

// ---- 5. The example file ----
const ex = JSON.parse(fs.readFileSync(path.join(root, 'examples', 'silk-road.json'), 'utf8'));
r = TL.normalize(ex, T.TEXT_KEYS);
eq(r.fixes, [], 'example opens without repairs');
p = r.project;
const a = TL.audit(p, O, T.TYPES, T.TEXT_KEYS);
eq(a.rows.filter((x) => x.level === 'fix').length, 0, 'example has nothing to fix');
const back = TL.normalize(Object.assign(TL.fromCSV(TL.toCSV(p), Object.assign(TL.blank(), { sources: p.sources, threads: p.threads })).raw), T.TEXT_KEYS).project;
eq(back.events.length, p.events.length, 'CSV export and import keep every event');
eq(back.events.reduce((n, e) => n + e.cites.length, 0), p.events.reduce((n, e) => n + e.cites.length, 0), 'CSV export and import keep every citation');
ok(p.disputes.every((d) => d.refs.every((id) => p.events.some((e) => e.id === id))), 'every dispute points to real events');

// ---- 6. Checks ----
const bad = TL.normalize({ threads: [{ id: 't', name: 'T' }], sources: [], events: [{ id: 'e1', date: '2020', text: 'x', cites: [] }, { id: 'e2', date: '2020', text: 'y', cites: [{ src: 'nope', loc: '' }] }], disputes: [{ title: 'd', refs: ['e9'] }] }, T.TEXT_KEYS).project;
const msgs = TL.audit(bad, O, T.TYPES, T.TEXT_KEYS).rows.map((x) => x.level + ': ' + x.msg);
ok(msgs.some((m) => /^fix: Event e1 has no citation/.test(m)), 'flags an event with no citation');
ok(msgs.some((m) => /^fix: Event e2 cites nope/.test(m)), 'flags a citation to a missing source');
ok(msgs.some((m) => /^fix: Dispute "d" points to e9/.test(m)), 'flags a dispute pointing nowhere');

// ---- 7. Media ----
eq(TL.videoLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m5s'), { host: 'youtube', id: 'dQw4w9WgXcQ', start: 65, label: 'YouTube' }, 'YouTube link with a start time');
eq(TL.videoLink('https://youtu.be/dQw4w9WgXcQ').id, 'dQw4w9WgXcQ', 'YouTube short link');
eq([TL.videoLink('https://vimeo.com/76979871/abc123def').id, TL.videoLink('https://vimeo.com/76979871/abc123def').hash], ['76979871', 'abc123def'], 'Vimeo link with a private hash');
eq(TL.videoLink('media/clip.mp4').host, 'file', 'a video file next to the page');
eq(TL.videoLink('https://example.org/page'), null, 'a page is not a video');
eq(TL.audioLink('media/call.mp3').url, 'media/call.mp3', 'a sound file next to the page');
eq(TL.embedLink('https://www.datawrapper.de/_/AbC12/').url, 'https://datawrapper.dwcdn.net/AbC12/', 'Datawrapper link becomes its embed');
eq(TL.embedLink('http://example.org'), null, 'embeds need https');
[['75', 75], ['1:15', 75], ['1:02:03', 3723], ['1m15s', 75], ['soon', null]].forEach(([v, w]) => eq(TL.parseTime(v), w, 'time ' + v));
eq(['https://x.org/a.jpg', 'media/a.jpg', 'javascript:alert(1)', '../secret.jpg', '/abs.jpg', '//x.org/a.jpg', 'data:text/html;base64,AAAA'].map((u) => TL.mediaSrc(u, '')), ['https://x.org/a.jpg', 'media/a.jpg', '', '', '', '', ''], 'only safe picture addresses are kept');
const bigPic = 'data:image/jpeg;base64,' + 'A'.repeat(300000);
eq(TL.mediaSrc(bigPic, '').length, bigPic.length, 'pictures kept inside the timeline are not cut short');
eq(TL.mediaSrc(bigPic, 'av'), '', 'video and sound are never kept inside the timeline');

// ---- 8. The background ----
const bgText = 'Opens [^b1] and [@s2, p. 4] and links [[e3|the arrest]].\n\n{{m1}}\n\nAgain [^b1], then [^b9].';
eq(TL.bgRefs(bgText).map((r) => r.type + ':' + (r.id || r.src)), ['cite:b1', 'cite:s2', 'event:e3', 'media:m1', 'cite:b1', 'cite:b9'], 'background markers are found in order');
eq(TL.bgNotes({ text: bgText, cites: [{ id: 'b1', src: 's1', loc: 'p. 1' }] }).num, { b1: 1, '@s2|p. 4': 2, b9: 3 }, 'notes are numbered as a reader meets them; a repeat keeps its number');
const v1 = TL.normalize({ format: 1, events: [{ id: 'e1', date: '2013', text: 'x', cites: [] }] }, T.TEXT_KEYS).project;
eq([v1.background.text, v1.background.cites.length, v1.events[0].media.length], ['', 0, 0], 'format 1 files open with an empty background and no media');
const withBg = TL.normalize({ format: 2, sources: [{ id: 's1', fields: { type: 'web', title: 'T', descType: 'Web Page', url: 'https://x.org' } }],
  background: { text: bgText + '\n\nA paragraph long enough to make several claims that a careful reader would want to check against a source.', cites: [{ id: 'b1', src: 's1', loc: 'p. 1' }, { id: 'b2', src: 's1', loc: '' }], media: [{ id: 'm1', kind: 'image', src: 'media/a.jpg', credit: 'Someone' }] },
  events: [{ id: 'e1', date: '2013', text: 'x', cites: [{ src: 's1', loc: 'p. 2' }], media: [{ kind: 'video', src: 'https://example.org/nope' }, { kind: 'compare', src: 'https://x.org/a.jpg', alt: 'a', cite: { src: 's1' } }] }] }, T.TEXT_KEYS).project;
const bm = TL.audit(withBg, O, T.TYPES, T.TEXT_KEYS).rows.map((x) => x.level + ': ' + x.msg);
ok(bm.some((m) => /^fix: The background cites s2, which is not in the source list/.test(m)), 'flags a direct citation to a missing source');
ok(bm.some((m) => /^fix: The background links to \[\[e3\]\]/.test(m)), 'flags a link to a missing event');
ok(bm.some((m) => /^fix: The background cites \[\^b9\]/.test(m)), 'flags a marker with no citation behind it');
ok(bm.some((m) => /^check: Background citation b2 is not placed/.test(m)), 'flags a citation never placed in the text');
ok(bm.some((m) => /^check: Background paragraph 3 .* has no citation/.test(m)), 'flags a long paragraph with no citation');
ok(bm.some((m) => /^check: The background, picture m1 credits its maker but cites no source/.test(m)), 'a credit without a source is a check');
ok(bm.some((m) => /^fix: Event e1, video m1: the link is not one the tool can play/.test(m)), 'flags a video link it cannot play');
ok(bm.some((m) => /^fix: Event e1, before-and-after m2 has no pair of pictures/.test(m)), 'flags a before-and-after missing a picture');
ok(!bm.some((m) => /Source s1 is not cited/.test(m)), 'background and media citations count as uses');

// ---- 9. The page carries a readable starting timeline ----
const boot = JSON.parse(html.match(/<script type="application\/json" id="tl-data">([\s\S]*?)<\/script>/)[1]);
eq(boot.mode, 'builder', 'page starts in builder mode');
ok(TL.normalize(boot.project, T.TEXT_KEYS).project.events.length > 0, 'page ships with a sample timeline');

console.log((failed ? 'FAILED ' : 'All passed: ') + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
