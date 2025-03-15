import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteTitle, SiteDescription } from "../data/site.json";

export async function GET(context) {
  const posts = await getCollection("posts");
  return rss({
    title: siteTitle,
    description: SiteDescription,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/posts/${post.id}/`,
    })),
  });
}
