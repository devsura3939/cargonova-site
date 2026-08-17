import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, getPost } from "@/data/blog";
import { BlogArticleChrome } from "@/components/blog/BlogArticleChrome";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
  const fallbackRelated = related.length > 0 ? related : posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            articleJsonLd({
              title: post.title,
              description: post.excerpt,
              path: `/blog/${slug}`,
              publishedAt: post.publishedAt,
              author: post.author,
            }),
            breadcrumbJsonLd([
              { name: "Insights", path: "/blog" },
              { name: post.title, path: `/blog/${slug}` },
            ]),
          ]),
        }}
      />

      <BlogArticleChrome post={post} related={fallbackRelated}>
        {/* Long-form article body (English by design) */}
        <article className="space-y-7">
          {post.body.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-lg font-medium leading-relaxed text-strong"
                  : "text-pretty leading-relaxed text-ink"
              }
            >
              {paragraph}
            </p>
          ))}
        </article>
      </BlogArticleChrome>

      <CTASection />
    </>
  );
}
