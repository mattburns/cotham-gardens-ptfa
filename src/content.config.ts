// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

// 3. Define your collection(s)
const events = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content/events' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eventDate: z.coerce.date(),
    image: z.string().optional()
  })
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { events };
