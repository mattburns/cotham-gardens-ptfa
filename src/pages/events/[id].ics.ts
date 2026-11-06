// One .ics file per event, so "Add to Apple Calendar / Outlook" is a plain link.
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { buildIcs, ICS_HEADERS, toCalendarEvent } from '@utils/calendar';

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await getCollection('events');
  return events.map((event) => ({
    params: { id: event.id },
    props: { event }
  }));
};

export const GET: APIRoute = ({ props, site }) => {
  const ev = toCalendarEvent(props.event, site!);
  return new Response(buildIcs([ev], site!, ev.title), {
    headers: ICS_HEADERS
  });
};
