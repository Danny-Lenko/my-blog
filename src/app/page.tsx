import axios from "axios";
import { BlogPostsPreview } from "@/components/BlogPostPreview";
import { BlogPostsPagination } from "@/components/BlogPostsPagination";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildStrapiQuery } from "@/lib/cmsQueryBuilder";

const Page = async (
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) => {
  const searchParams = await props.searchParams;
  const queryString = buildStrapiQuery(
    {
      sort: 'createdAt:asc',
      pagination: {pageSize: 6},
      populate: {
        author: {
          fields: ['name', 'image'],
        },
        tags: {
          fields: ['id', 'name'],
        },
      },
    },
    searchParams
  );

  const result = await axios.get(`${process.env.API_HOST}/api/articles?${queryString}`)

  return (
    <div className="container mx-auto px-5 mb-10">
      <Header />      
      <BlogPostsPreview posts={result.data.data} />
      <BlogPostsPagination pagination={result.data.meta.pagination} />
      <Footer />
    </div>
  );
};

export default Page;
