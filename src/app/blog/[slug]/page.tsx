import { notFound } from "next/navigation";
import axios from "axios";
import { BlogPostContent } from "@/components/BlogPostContent";
import { CommentSection } from "@/components/CommentSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RelatedPosts } from "@/components/RelatedPosts";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import { buildStrapiQuery } from "@/lib/cmsQueryBuilder";


export async function generateMetadata(props: { params: Promise<Params> }) {
  const params = await props.params;
 
  const { slug } = params;
  
  const res = await axios.get(
    `${process.env.API_HOST}/api/articles?filters[slug][$eq]=${slug}&populate=*`
  );

  const result = res.data.data?.[0];

  if (!res || !result) {
    return notFound();
  }
  
  if (!result || !result.post) {
    return {
      title: "Blog post not found",
    };
  }

  const { title, description, image } = result.post;
  const generatedOgImage = signOgImageUrl({ title, brand: config.blog.name });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [generatedOgImage, image] : [generatedOgImage],
    },
  };
}

interface Params {
  slug: string;
}

const Page = async (props: { params: Promise<Params> }) => {
  const params = await props.params;

  const { slug } = params;

  const res = await axios.get(
    `${process.env.API_HOST}/api/articles?filters[slug][$eq]=${slug}&populate=*`
  );
  
  const result = res.data.data?.[0];

  if (!res || !result) {
    return notFound();
  }

  const { title, description, publishedAt, updatedAt, image, author, content } = result;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      // "@id": `${config.siteUrl}/blog/${slug}` ADD A PROD HOST URL
    },
    headline: title,
    image: image ?? undefined,
    "description": description ?? "", // якщо є опис
    datePublished: publishedAt ? publishedAt.toString() : undefined,
    dateModified: updatedAt.toString(),
    author: {
      "@type": "Person",
      name: author.name ?? undefined,
      image: author.image ?? undefined,
    },
  };

  const queryString = buildStrapiQuery(
    {
      sort: 'publishedAt:asc',
      pagination: {pageSize: 3},
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-5">
        <Header />
        <div className="max-w-prose mx-auto text-xl">
          <BlogPostContent post={result} />
          <RelatedPosts posts={posts.data.data} />
          <CommentSection slug={slug} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Page;
