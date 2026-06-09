import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    stage: z.union([z.number(), z.string()]),
    title: z.string(),
    key_concepts: z.array(z.string()).default([]),
    practical_steps: z.number().default(0),
    anti_patterns: z.number().default(0),
    summary: z.string().default(''),
    key_takeaways: z.array(z.string()).default([]),
    prev: z.string().optional(),
    next: z.string().optional(),
    lang: z.enum(['en', 'zh']).default('en'),
    zh_title: z.string().optional(),
  }),
});

export const collections = { docs };