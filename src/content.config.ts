import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
const links=z.array(z.object({label:z.string().min(1),url:z.url()})).default([]);
const projects=defineCollection({
 loader:glob({base:'./src/content/projects',pattern:'**/*.{md,mdx}'}),
 schema:z.object({
 title:z.string(),shortTitle:z.string(),summary:z.string(),
 group:z.enum(['featured','papers','projects']),order:z.number().int().positive(),
 status:z.enum(['Working paper','Published','Research project','Open source']),
 dates:z.string(),role:z.string(),
 visual:z.enum(['transport','laplace','video','capacity','relations','optimization','decoupled','market','agents']),
 demo:z.enum(['transport','laplace','capacity','relations','optimization','decoupled']).optional(),
 publications:z.array(reference('publications')).default([]),links,
 }),
});
const publications=defineCollection({
 loader:glob({base:'./src/content/publications',pattern:'**/*.md'}),
 schema:z.object({title:z.string(),authors:z.array(z.string()).min(1),year:z.number().int(),venue:z.string(),highlight:z.string().optional(),summary:z.string(),links}),
});
export const collections={projects,publications};
