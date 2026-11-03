import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export async function blogPosts({ includeDrafts = false } = {}): Promise<BlogPost[]> {
  const now = Date.now();
  const posts = await getCollection('blog', ({ data }) =>
    includeDrafts || (!data.draft && data.date.getTime() <= now),
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

export function postUrl(post: BlogPost): string {
  return `/blog/${post.id.split('/').map(encodeURIComponent).join('/')}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Shanghai',
  }).format(date);
}

export function readingMinutes(post: BlogPost): number {
  const words = (post.body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
