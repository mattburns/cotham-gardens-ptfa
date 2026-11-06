// Helpers for "Add to calendar" links and .ics files.
//
// Dates in event frontmatter carry a timezone offset (or are a bare date for
// an all-day event), so the Date objects we get from the content collection
// are absolute instants. We emit them in UTC and let the calendar app convert
// to the reader's local time.
import type { CollectionEntry } from 'astro:content';
import { markdownToText } from './text';

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  url: string;
};

// A bare date in frontmatter (e.g. `eventDate: 2025-03-28`) parses as midnight
// UTC. Treat that as an all-day event rather than one starting at midnight.
function isMidnightUtc(d: Date): boolean {
  return (
    d.getUTCHours() === 0 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0
  );
}

export function toCalendarEvent(
  event: CollectionEntry<'events'>,
  site: URL
): CalendarEvent {
  const start = event.data.eventDate;
  const allDay = isMidnightUtc(start);
  let end = event.data.endDate;
  if (!end || end <= start) {
    end = new Date(
      start.getTime() + (allDay ? ONE_DAY_MS : DEFAULT_DURATION_MS)
    );
  }
  return {
    id: event.id,
    title: event.data.title,
    description: markdownToText(event.body),
    location: event.data.location,
    start,
    end,
    allDay,
    url: new URL(`/events/${event.id}/`, site).toString()
  };
}

const pad = (n: number) => String(n).padStart(2, '0');

// 20251213T080000Z
function formatUtcDateTime(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

// 20251213
function formatUtcDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

// ---------------------------------------------------------------------------
// Google Calendar "add event" link
// ---------------------------------------------------------------------------

export function googleCalendarUrl(ev: CalendarEvent): string {
  const dates = ev.allDay
    ? `${formatUtcDate(ev.start)}/${formatUtcDate(ev.end)}`
    : `${formatUtcDateTime(ev.start)}/${formatUtcDateTime(ev.end)}`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates,
    details: [ev.description, ev.url].filter(Boolean).join('\n\n'),
    ctz: 'Europe/London'
  });
  if (ev.location) params.set('location', ev.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// iCalendar (.ics) output — used by Apple Calendar, Outlook and for the
// subscribable feed. See RFC 5545.
// ---------------------------------------------------------------------------

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// Lines must be at most 75 octets; longer lines are continued on the next
// line, prefixed with a single space.
function foldIcsLine(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = '';
  let currentBytes = 0;
  for (const ch of line) {
    const chBytes = new TextEncoder().encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (currentBytes + chBytes > limit) {
      out.push(current);
      current = '';
      currentBytes = 0;
    }
    current += ch;
    currentBytes += chBytes;
  }
  if (current) out.push(current);
  return out.join('\r\n ');
}

function icsEvent(ev: CalendarEvent, site: URL, stamp: Date): string[] {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${ev.id}@${site.hostname}`,
    `DTSTAMP:${formatUtcDateTime(stamp)}`,
    ev.allDay
      ? `DTSTART;VALUE=DATE:${formatUtcDate(ev.start)}`
      : `DTSTART:${formatUtcDateTime(ev.start)}`,
    ev.allDay
      ? `DTEND;VALUE=DATE:${formatUtcDate(ev.end)}`
      : `DTEND:${formatUtcDateTime(ev.end)}`,
    `SUMMARY:${escapeIcsText(ev.title)}`,
    `URL:${ev.url}`
  ];
  if (ev.description) {
    lines.push(
      `DESCRIPTION:${escapeIcsText(ev.description + '\n\n' + ev.url)}`
    );
  }
  if (ev.location) lines.push(`LOCATION:${escapeIcsText(ev.location)}`);
  lines.push('END:VEVENT');
  return lines;
}

export function buildIcs(
  events: CalendarEvent[],
  site: URL,
  calendarName: string
): string {
  const stamp = new Date(); // build time
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${site.hostname}//Events//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
    'X-WR-TIMEZONE:Europe/London',
    ...events.flatMap((ev) => icsEvent(ev, site, stamp)),
    'END:VCALENDAR'
  ];
  return lines.map(foldIcsLine).join('\r\n') + '\r\n';
}

export const ICS_HEADERS = {
  'Content-Type': 'text/calendar; charset=utf-8'
};
