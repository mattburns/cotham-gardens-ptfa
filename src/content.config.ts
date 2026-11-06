// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

// 3. Define your collection(s)
const events = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/events' }),
  schema: z.object({
    title: z.string(),
    eventDate: z.coerce.date(),
    // Optional: when the event finishes. Defaults to 2 hours after the start
    // in calendar links if left blank.
    endDate: z.coerce.date().optional(),
    // Optional: free-text venue, e.g. "Cotham Gardens Primary School, Main Hall"
    location: z.string().optional(),
    image: z.string().optional()
  })
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { events };
