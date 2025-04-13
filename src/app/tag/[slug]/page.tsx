import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { buildStrapiQuery } from "@/lib/cmsQueryBuilder";
import axios from "axios";
import { CircleX } from "lucide-react";
import Link from "next/link";

interface Params {
  slug: string;
}

export async function generateMetadata(
  props: {
    params: Promise<Params>;
  }
) {
  const params = await props.params;

  const {
    slug
  } = params;

  return {
    title: `#${slug}`,
    description: `Posts tagged with #${slug}`,
  };
}

const Page = async (
  props: {
    params: Promise<Params>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    slug
  } = params;

  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;

  const queryString = buildStrapiQuery(
    {
      filters: {
        tags: {
          name: {
            $eq: slug
          },
        },
      },
      sort: 'publishedAt:asc',
      pagination: {pageSize: 6, page},
      populate: {
        author: {
          fields: ['name', 'image'],
        },
        tags: {
          fields: ['name'],
        },
      }
    }
  );

  const posts = await axios.get(`${process.env.API_HOST}/api/articles?${queryString}`)

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header />
      <Link href="/">
        <Badge className="px-2 py-1">
          <CircleX className="inline-block w-4 h-4 mr-2" />
          Posts tagged with <strong className="mx-2">#{slug}</strong>{" "}
        </Badge>
      </Link>
      <BlogPostsPreview posts={posts.data.data} />
      <BlogPostsPagination
        pagination={posts.data.meta.pagination}
        basePath={`/tag/${slug}/?page=`}
      />
      <Footer />
    </div>
  );
};

export default Page;
