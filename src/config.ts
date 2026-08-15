const publicSiteUrl = import.meta.env.PUBLIC_SITE_URL ?? 'https://pixelhero98.github.io';

export const siteConfig = {
	name: 'Zinuo (Henry) You',
	shortName: 'Zinuo You',
	headline: 'Generative systems researcher',
	description:
		'Researching video and world models, efficient generative inference, and continuous-time learning.',
	domain: publicSiteUrl.replace(/\/$/, ''),
	email: 'zinuo.you@bristol.ac.uk',
	availability: 'Open to research scientist and applied scientist opportunities',
	github: 'https://github.com/pixelhero98',
	scholar: 'https://scholar.google.com/citations?user=ck7JGfgAAAAJ&hl=en',
	cvPath: '/resume/Zinuo_You_EN.pdf',
	portraitPath: null,
} as const;

export type SiteConfig = typeof siteConfig;
