import rss from '@astrojs/rss';
import { blogPosts, postUrl } from '../../lib/blog';
import { siteConfig } from '../../config';

export async function GET() {
  const posts = await blogPosts();
  return rss({
    title: `${siteConfig.shortName} — Blog`,
    description: 'Notes on generative modelling, reinforcement learning, and optimization.',
    site: siteConfig.domain,
    items: posts.map(post => ({
      title: post.data.title, description: post.data.description,
      pubDate: post.data.date, link: postUrl(post), categories: post.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
