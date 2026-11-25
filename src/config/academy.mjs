// Academy program configuration — the one place program inputs live.
//
// DEPOSIT (ruled by Carlos, 2026-11-25 ~06:52 PT, explicit options card):
// "Deposit — the deck model wins: free attendance with a $10–$25
// commitment deposit, refunded on attendance." The step is ON and the
// site copy states the model plainly. Two mechanics the record does NOT
// specify stay config-gated here, per the build instruction — do not
// invent terms elsewhere:
//   - amountUsd: the exact figure inside the deck's $10–$25 range.
//   - stripePaymentLink: the Stripe Payment Link that collects it.
// When stripePaymentLink is set, the application's step 3 sends the
// applicant to Stripe after submit and the success page says so. Until
// then the step records the applicant's acknowledgment and the
// application completes; the row lands with deposit_status
// 'pending-config' so the Village can collect once the link exists.
export const deposit = {
  enabled: true,
  rangeLabel: '$10–$25',
  amountUsd: null,
  stripePaymentLink: '',
};

// COHORT 1 — the founding cohort. Documented program inputs: launches
// January 2027 in Stockton, CA; two-hour evening sessions; 20 seats;
// sessions 1–6 monthly, then twice monthly once the room holds
// (sessions 7–24). Exact calendar evenings are a program input Carlos
// has not set anywhere in the record — set `exactDates` (keyed by
// session number, ISO date) and the cohort page, Event schema, and
// .ics files upgrade from month markers to real datetimes in the
// same build, no other edit needed.
export const cohort = {
  number: 1,
  name: 'Founding cohort',
  launchMonth: { year: 2027, month: 1 }, // January 2027
  city: 'Stockton',
  region: 'CA',
  seats: 20,
  sessionLength: 'Two-hour evening sessions',
  monthlyThroughSession: 6, // sessions 1–6 monthly; 7–24 twice monthly
  exactDates: {},
};

// Month slot for a session under the documented cadence:
// sessions 1–6 monthly from January 2027; sessions 7–24 twice monthly.
export function sessionMonth(n) {
  const { year, month } = cohort.launchMonth;
  let offset;
  if (n <= cohort.monthlyThroughSession) {
    offset = n - 1;
  } else {
    offset = cohort.monthlyThroughSession + Math.floor((n - cohort.monthlyThroughSession - 1) / 2);
  }
  const idx = (month - 1) + offset;
  return { year: year + Math.floor(idx / 12), month: (idx % 12) + 1 };
}

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export function monthLabel(n, lang = 'en') {
  const { year, month } = sessionMonth(n);
  const names = lang === 'es' ? MONTHS_ES : MONTHS_EN;
  return lang === 'es' ? `${names[month - 1]} de ${year}` : `${names[month - 1]} ${year}`;
}

// The spine (cc3po-ops Supabase). The anon key is public by design — it
// ships in page source across the fleet; the academy tables' RLS
// policies (anon INSERT only, validated by CHECK constraints) do the
// protecting. Same pattern as music.cc3po.com's spine.ts.
export const spine = {
  url: 'https://cdrcgmdvepxwsbqaifxv.supabase.co',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcmNnbWR2ZXB4d3NicWFpZnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDY4MDksImV4cCI6MjA4OTA4MjgwOX0.pKWLWvsSimTOMkpaXKKrLJESrQEMUayUU1c9ANzr1Dc',
};
