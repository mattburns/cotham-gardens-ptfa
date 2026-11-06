// A single subscribable calendar feed of every event. Regenerated on each
// deploy, so new events added via the CMS appear in subscribers' calendars
// automatically.
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { buildIcs, ICS_HEADERS, toCalendarEvent } from '@utils/calendar';

export const GET: APIRoute = async ({ site }) => {
  const events = (await getCollection('events'))
    .sort((a, b) => a.data.eventDate.valueOf() - b.data.eventDate.valueOf())
    .map((event) => toCalendarEvent(event, site!));
  return new Response(buildIcs(events, site!, 'Cotham Gardens PTFA Events'), {
    headers: ICS_HEADERS
  });
};
