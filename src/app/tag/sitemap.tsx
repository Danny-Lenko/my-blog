import axios from "axios";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";
import { config } from "@/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await (await axios.get(`${process.env.API_HOST}/api/tags`)).data.data;

  return [
    {
      url: urlJoin(config.baseUrl, "tag"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...result((tag: { name: string; }) => {
      return {
        url: urlJoin(config.baseUrl, "tag", tag.name),
        lastModified: new Date(),
        priority: 0.8,
      };
    }),
  ];
}
