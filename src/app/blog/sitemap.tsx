import axios from "axios";
import urlJoin from "url-join";
import { config } from "@/config";
import { buildStrapiQuery } from "@/lib/cmsQueryBuilder";
import type { MetadataRoute } from "next";

// thought on SEO for a blog: https://chatgpt.com/c/67f8e8d4-a1b0-8013-ad05-c57c3098fe52 | devdanny

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  const queryString = buildStrapiQuery(
    {
      sort: 'publishedAt:asc',
      populate: {
        author: {
          fields: ['name', 'image'],
        },
        tags: {
          fields: ['name'],
        },
      },
    }
  );

  const posts = await axios.get(`${process.env.API_HOST}/api/articles?${queryString}`)

  return [
    {
      url: urlJoin(config.baseUrl, "blog"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...posts.data.data.map((post: { slug: string; updatedAt: string | number | Date; }) => {
      return {
        url: urlJoin(config.baseUrl, "blog", post.slug),
        lastModified: new Date(post.updatedAt),
        priority: 0.8,
      };
    }),
  ];
}
