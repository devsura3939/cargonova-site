import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, CalendarDays } from "lucide-react";
import { posts, getPost } from "@/data/blog";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Container } from "@/components/shared/Container";
import { Section } from "@/components/shared/Section";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/shared/Reveal";
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

  const published = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(post.publishedAt));

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

      {/* Article header */}
      <section className="relative overflow-hidden bg-navy-900 pb-16 pt-28 text-white sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-grid-dark" />
        <div className="pointer-events-none absolute -top-40 right-[-10%] h-105 w-105 rounded-full bg-electric-500/20 blur-[120px]" />
        <Container className="relative">
          <Breadcrumb
            dark
            items={[
              { name: "Insights", path: "/blog" },
              { name: post.title, path: `/blog/${slug}` },
            ]}
          />
          <div className="mt-8 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-electric-500 px-3 py-1 text-white">{post.category}</span>
              <span className="flex items-center gap-1.5 text-navy-300">
                <Clock className="h-3.5 w-3.5" /> {post.readTime} read
              </span>
              <span className="flex items-center gap-1.5 text-navy-300">
                <CalendarDays className="h-3.5 w-3.5" /> {published}
              </span>
            </div>
            <h1 className="mt-5 text-balance font-display text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-navy-200 sm:text-lg">
              {post.excerpt}
            </p>
            <p className="mt-7 text-sm font-semibold text-navy-300">By {post.author}</p>
          </div>
        </Container>
      </section>

      {/* Body */}
      <Section variant="light">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="relative mb-10 h-64 overflow-hidden rounded-3xl shadow-card sm:h-80">
              <Image
                src={post.image}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/30 to-transparent" />
            </div>
            <article className="space-y-7">
              {post.body.map((paragraph, i) => (
                <p key={i} className={i === 0 ? "text-lg font-medium leading-relaxed text-navy-900" : "text-pretty leading-relaxed text-ink"}>
                  {paragraph}
                </p>
              ))}
            </article>

            <div className="mt-12 rounded-3xl border border-navy-100 bg-mist p-7 sm:p-9">
              <h2 className="font-display text-xl font-bold text-navy-900">Put this into practice</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                The ideas in this article apply to real shipments. Tell us what you're moving
                and we'll show you how they work on your routes.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/quote"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-electric-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-electric-400"
                >
                  Get a quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-6 text-sm font-semibold text-navy-800 transition-colors hover:border-electric-400 hover:text-electric-600"
                >
                  Talk to a specialist
                </Link>
              </div>
            </div>

            <Link
              href="/blog"
              className="group mt-10 inline-flex items-center gap-2 text-sm font-semibold text-electric-600 transition-colors hover:text-electric-500"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to all insights
            </Link>
          </Reveal>
        </Container>
      </Section>

      {/* Related */}
      {fallbackRelated.length > 0 ? (
        <Section variant="mist">
          <Container>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-navy-900">
              Continue reading
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {fallbackRelated.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-semibold text-electric-600">{p.category}</span>
                    <h3 className="mt-2.5 flex-1 font-display text-base font-bold leading-snug text-navy-900 transition-colors group-hover:text-electric-600">
                      {p.title}
                    </h3>
                    <span className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-electric-600">
                      Read article
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <CTASection />
    </>
  );
}
