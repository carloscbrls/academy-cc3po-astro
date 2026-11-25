#!/usr/bin/env node
// Generates the site's downloadable assets from the SAME sources that
// render the pages — never hand-maintained copies:
//   public/downloads/curriculum-guide.pdf   ← src/data/curriculum.mjs
//   public/downloads/employer-one-pager.pdf ← the partners page copy
//   public/calendar/session-NN.ics          ← curriculum + cohort config
//   public/calendar/cohort-1.ics            ← all 24 sessions
//
// Until exact session evenings are set (src/config/academy.mjs →
// cohort.exactDates), .ics files are MONTH MARKERS: an all-day,
// transparent entry on the 1st of the session's cadence month, labeled
// "date to be confirmed". When an exact date is set for a session, its
// .ics becomes a real timed event automatically.
//
// Run: node scripts/generate-assets.mjs   (needs playwright — resolves
// from the repo's node_modules or the fleet-ci install on this machine)
import { mkdirSync, writeFileSync } from 'node:fs';
import { quarters, projects, sessions } from '../src/data/curriculum.mjs';
import { cohort, deposit, sessionMonth } from '../src/config/academy.mjs';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------------- .ics ---------------- */
const icsEscape = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const pad = (n) => String(n).padStart(2, '0');

function sessionEvent(n) {
  const s = sessions.find((x) => x.n === n);
  const exact = cohort.exactDates[n];
  const { year, month } = sessionMonth(n);
  const title = `CC3PO AI Builders — Session ${n}: ${s.title}`;
  const desc = `You leave with: ${s.artifact}. Two-hour evening session, Stockton, CA. Free to attend; a refundable commitment deposit holds cohort seats.`;
  const lines = ['BEGIN:VEVENT', `UID:academy-session-${n}@academy.cc3po.com`, 'DTSTAMP:20261125T120000Z'];
  if (exact && /^\d{4}-\d{2}-\d{2}T/.test(exact)) {
    // Floating local datetime from config, 2h duration.
    const start = exact.replace(/[-:]/g, '');
    const d = new Date(exact);
    d.setHours(d.getHours() + 2);
    const end = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    lines.push(`DTSTART:${start.length === 15 ? start : start + '00'}`, `DTEND:${end}`, 'TRANSP:OPAQUE', `SUMMARY:${icsEscape(title)}`);
  } else if (exact && /^\d{4}-\d{2}-\d{2}$/.test(exact)) {
    lines.push(`DTSTART;VALUE=DATE:${exact.replace(/-/g, '')}`, 'TRANSP:OPAQUE', `SUMMARY:${icsEscape(title)}`);
  } else {
    const first = `${year}${pad(month)}01`;
    lines.push(
      `DTSTART;VALUE=DATE:${first}`,
      'TRANSP:TRANSPARENT',
      `SUMMARY:${icsEscape(title + ` (evening to be confirmed — ${year}-${pad(month)})`)}`,
    );
  }
  lines.push(`DESCRIPTION:${icsEscape(desc)}`, 'LOCATION:Stockton\\, CA', 'END:VEVENT');
  return lines.join('\r\n');
}

const calHeader = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CC3PO//Academy//EN', 'CALSCALE:GREGORIAN'];
mkdirSync(new URL('../public/calendar', import.meta.url), { recursive: true });
for (const s of sessions) {
  writeFileSync(new URL(`../public/calendar/session-${pad(s.n)}.ics`, import.meta.url), [...calHeader, sessionEvent(s.n), 'END:VCALENDAR'].join('\r\n') + '\r\n');
}
writeFileSync(
  new URL('../public/calendar/cohort-1.ics', import.meta.url),
  [...calHeader, ...sessions.map((s) => sessionEvent(s.n)), 'END:VCALENDAR'].join('\r\n') + '\r\n',
);
console.log('ics: 24 session files + cohort-1.ics');

/* ---------------- PDFs ---------------- */
const printCss = `
  @page { margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; margin: 0; font-size: 11pt; line-height: 1.5; }
  h1 { font-size: 24pt; margin: 0 0 4pt; letter-spacing: -0.01em; }
  h2 { font-size: 14pt; margin: 20pt 0 6pt; border-bottom: 2px solid #c9a227; padding-bottom: 3pt; }
  h3 { font-size: 11.5pt; margin: 12pt 0 4pt; }
  .kicker { color: #8a6d1c; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em; font-size: 8.5pt; }
  .sub { color: #444; margin: 0 0 10pt; }
  table { width: 100%; border-collapse: collapse; margin: 4pt 0 10pt; }
  td, th { text-align: left; padding: 4pt 6pt; border-bottom: 1px solid #ddd; vertical-align: top; font-size: 10pt; }
  td.n { width: 26pt; color: #8a6d1c; font-weight: bold; }
  td.a { color: #555; width: 38%; }
  ul { margin: 4pt 0 10pt; padding-left: 16pt; }
  li { margin-bottom: 4pt; }
  .foot { margin-top: 22pt; padding-top: 8pt; border-top: 1px solid #ccc; color: #555; font-size: 9.5pt; }
  strong { color: #111; }
`;

const guideHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${printCss}</style></head><body>
  <p class="kicker">CC3PO AI Builders · Stockton, California</p>
  <h1>The Curriculum Guide</h1>
  <p class="sub">Applied AI &amp; Automation Lab — from first principles to shipped systems.
  24 sessions, 8 portfolio projects. Free to attend; a ${deposit.rangeLabel} commitment deposit holds your seat and is refunded on attendance.
  Sessions run two hours, evenings — monthly for the first six, twice monthly after. Cohort 1 opens January 2027. Twenty seats.</p>
  <p class="sub">Two tracks work the same arc: <strong>Operator</strong> (zero code — n8n, Make, Dify, Sheets) and <strong>Builder</strong> (Python, FastAPI, Docker, GitHub). The first four sessions need zero code either way.</p>
  ${quarters.map((q) => `
    <h2>${esc(q.label)} — ${esc(q.title)}</h2>
    <table>${q.sessions.map((s) => `<tr><td class="n">${pad(s.n)}</td><td>${esc(s.title)}</td><td class="a">You leave with: ${esc(s.artifact)}</td></tr>`).join('')}</table>
  `).join('')}
  <h2>The 8 projects</h2>
  <table>${projects.map((p) => `<tr><td>${esc(p.name)}</td><td class="a">${esc(p.bar)}</td></tr>`).join('')}</table>
  <p class="foot">Apply at academy.cc3po.com/apply — applications are read by a human. Questions: 209-701-1137 · CC3PO LLC, 16299 Adobe Way, Lathrop, CA 95330.</p>
</body></html>`;

const pagerHtml = `<!doctype html><html><head><meta charset="utf-8"><style>${printCss}</style></head><body>
  <p class="kicker">For employers &amp; community partners</p>
  <h1>Your people leave with systems that run.</h1>
  <p class="sub">The CC3PO AI Builders Lab — "CC3PO AI Builders: From First Principles to Shipped Systems" — is a hands-on AI and automation program taught in Stockton by a former Tesla Vision engineer. The pilot year is free.</p>
  <h2>What your people get</h2>
  <ul>
    <li><strong>24 working sessions over 12 months</strong> — two-hour evenings, monthly to start. Every session ends with a running artifact: a live URL, a workflow, a deployed service.</li>
    <li><strong>Two tracks.</strong> Operator (zero code — n8n, Make, Dify, Sheets) for staff who run operations; Builder (Python, FastAPI, Docker, GitHub) for technical staff.</li>
    <li><strong>8 portfolio projects</strong>, each with a technical bar and a business bar. The artifact is the credential — your people can show what they built, not just that they attended.</li>
    <li><strong>Real problems from the room.</strong> Members bring their own business problems and build them live — the work product goes back to the workplace.</li>
    <li><strong>Demo Day.</strong> The cohort presents its shipped systems publicly at the end of the run.</li>
  </ul>
  <h2>What it costs, honestly</h2>
  <ul>
    <li><strong>Free for the pilot year</strong> — for individuals, and for residents and staff of partner organizations.</li>
    <li><strong>A ${deposit.rangeLabel} commitment deposit</strong> per seat, refunded on attendance. It exists so the 20 seats go to people who show up.</li>
    <li><strong>Time:</strong> one two-hour evening a month to start. That's the whole ask of your schedule.</li>
  </ul>
  <h2>How to take part</h2>
  <ul>
    <li><strong>Send people:</strong> the application is at academy.cc3po.com/apply — a human reads every one.</li>
    <li><strong>Partner with the Lab:</strong> community organizations can refer residents and staff, and talk with us about hosting or supporting a cohort. Call 209-701-1137.</li>
    <li><strong>Come see it first:</strong> RSVP for Session 1 at academy.cc3po.com/cohort — no obligation.</li>
  </ul>
  <p class="foot">CC3PO LLC · 16299 Adobe Way, Lathrop, CA 95330 · 209-701-1137 · academy.cc3po.com</p>
</body></html>`;

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  const { createRequire } = await import('node:module');
  ({ chromium } = createRequire('/home/hatch/workspace/fleet-ci/package.json')('playwright'));
}
mkdirSync(new URL('../public/downloads', import.meta.url), { recursive: true });
const browser = await chromium.launch();
for (const [html, out] of [[guideHtml, 'curriculum-guide.pdf'], [pagerHtml, 'employer-one-pager.pdf']]) {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  const buf = await page.pdf({ format: 'Letter', printBackground: true });
  writeFileSync(new URL(`../public/downloads/${out}`, import.meta.url), buf);
  console.log(`pdf: ${out} (${buf.length} bytes)`);
  await page.close();
}
await browser.close();
