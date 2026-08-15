import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const linkSchema = z.object({
	label: z.string().min(1),
	url: z.url(),
});

const mediaSchema = z.object({
	type: z.enum(['image', 'video']),
	src: z.string().regex(/^(https?:\/\/|\/)/, 'Media sources must be absolute web URLs or root-relative paths'),
	poster: z.string().regex(/^(https?:\/\/|\/)/).optional(),
	alt: z.string().min(1),
	caption: z.string().min(1),
});

const projectSchema = z.object({
	title: z.string().min(1),
	tagline: z.string().min(1),
	status: z.enum(['accepted', 'ongoing', 'open-source', 'published']),
	dates: z.string().min(1),
	themes: z.array(z.string().min(1)).min(1),
	role: z.string().min(1),
	collaborators: z.array(z.string().min(1)).default([]),
	problem: z.string().min(1),
	approach: z.string().min(1),
	evidence: z.array(z.string().min(1)).min(1),
	media: z.array(mediaSchema).default([]),
	visual: z.enum(['video', 'clock', 'laplace', 'code', 'graph', 'market', 'agents']),
	links: z.array(linkSchema).default([]),
	disclosure: z.string().optional(),
	featuredOrder: z.number().int().positive().optional(),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: projectSchema,
});

const publicationSchema = z.object({
	title: z.string().min(1),
	authors: z.array(z.string().min(1)).min(1),
	year: z.number().int().min(2000),
	venue: z.string().min(1),
	status: z.enum(['accepted', 'published', 'preprint', 'under-review']),
	highlight: z.string().optional(),
	summary: z.string().min(1),
	links: z.array(linkSchema).default([]),
});

const publications = defineCollection({
	loader: glob({ base: './src/content/publications', pattern: '**/*.{md,mdx}' }),
	schema: publicationSchema,
});

export const collections = { projects, publications };
export type ProjectEntry = z.infer<typeof projectSchema>;
export type PublicationEntry = z.infer<typeof publicationSchema>;
