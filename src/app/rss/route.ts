export const revalidate = 3600; // 1 hour

import axios from "axios";
import { NextResponse } from "next/server";
import RSS from "rss";
import urlJoin from "url-join";
import { config } from "@/config";

import { buildStrapiQuery } from "@/lib/cmsQueryBuilder";

const baseUrl = config.baseUrl;

export async function GET() {
  const queryString = buildStrapiQuery(
    {
      sort: 'publishedAt:desc',
      pagination: {pageSize: 20},
    }
  );

  const res = await axios.get(`${process.env.API_HOST}/api/articles?${queryString}`)

  const posts = res.data.data.map((post: { title: string; description: string; slug: string; publishedAt: string; }) => {
    return {
      title: post.title,
      description: post.description || "",
      url: urlJoin(baseUrl, `/blog/${post.slug}`),
      date: post.publishedAt || new Date(),
    };
  });

  const feed = new RSS({
    title: config.blog.name,
    description: config.blog.metadata.description,
    site_url: baseUrl,
    feed_url: urlJoin(baseUrl, "/rss"),
    pubDate: new Date(),
  });
  posts.forEach((post: RSS.ItemOptions) => {
    feed.item(post);
  });

  const xml: string = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET",
    },
  });
}
