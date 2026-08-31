import { notFound } from "next/navigation";

// Adjust these paths if this file moves relative to /public/data
import articlesData from "../../../public/data/article.json";
import authorsData from "../../../public/data/author.json";

/**
 * app/[category]/[slug]/page.jsx — article detail page
 *
 * Route example: /china/china-aid-training-alumni-workshop-sri-lanka
 *
 * Data source: public/data/articles.json (organized by category) +
 * public/data/authors.json, merged together by authorSlug in getArticle().
 *
 * Layout: two columns on lg+ — article (8/12) + sticky "Related Stories"
 * sidebar (4/12). Body content is a list of blocks. "About the Author"
 * card sits after the body and before the tags.
 *
 * SEO: generateMetadata() covers title, description, canonical URL, OG,
 * Twitter card. JSON-LD covers NewsArticle, BreadcrumbList, Organization —
 * all sourced from articlesData + authorsData.
 *
 * Next.js note: `params` is async in the App Router (Next 15+).
 *
 * Palette (matches the rest of the site):
 *   masthead-red  #D01418
 *   ink           #1A1A1A
 *   ink-soft      #595959
 *   rule          #E5E5E5
 */

// --- Site-wide constants (NOT article-specific, so NOT in article.json) ---
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"; // ⚠️ replace
const SITE_NAME = "Global Times"; // matches the "| Global Times" suffix already in your title
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

function getAbsoluteUrl(path) {
  if (!path) return DEFAULT_OG_IMAGE;
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

// Looks up the article matching { category, slug } in articles.json, and
// merges in author details (name, role, bio, avatar, social) from
// authors.json via authorSlug.
function getArticle(category, slug) {
  const post = (articlesData[category] || []).find((p) => p.slug === slug);

  if (!post) return null;

  const authorInfo = authorsData[post.authorSlug] || {};

  return {
    category,
    slug: post.slug,
    headline: post.headline,
    dek: post.dek,
    author: authorInfo.name || post.authorSlug,
    authorSlug: post.authorSlug,
    authorRole: authorInfo.role || "",
    authorImage: authorInfo.avatarImage || "",
    authorBio: authorInfo.bio || "",
    authorSocial: authorInfo.social || {},
    source: post.source,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    heroImage: post.heroImage,
    heroCaption: post.heroCaption,
    heroCredit: post.heroCredit,
    tags: post.tags || [],
    body: post.body || [],
  };
}

// Up to `count` other articles from the same category, excluding the current one
function getRelatedArticles(category, excludeSlug, count = 4) {
  return (articlesData[category] || [])
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, count)
    .map((p) => ({
      category,
      slug: p.slug,
      headline: p.headline,
      heroImage: p.heroImage,
    }));
}

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// generateMetadata — title, description, canonical URL, OG, Twitter card,
// all sourced from article.json (via getArticle) + author.json
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const url = `${SITE_URL}/${category}/${slug}`;
  const imageUrl = getAbsoluteUrl(article.heroImage);

  return {
    title: `${article.headline} | ${SITE_NAME}`,
    description: article.dek,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.headline,
      description: article.dek,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt || undefined,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.heroCaption || article.headline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.dek,
      images: [imageUrl],
    },
  };
}

function ImagePlaceholder({ label, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#EDEDED] text-[#A0A0A0] font-sans text-[11px] uppercase tracking-wide ${className}`}
      aria-label={`${label} image placeholder`}
    >
      {label}
    </div>
  );
}

function ArticleImage({ imageUrl, alt, className = "" }) {
  if (!imageUrl) {
    return <ImagePlaceholder label={alt || "image"} className={className} />;
  }
  return (
    <div className={`overflow-hidden max-w-full ${className}`}>
      <img src={imageUrl} alt={alt} className="block w-full h-full object-cover" />
    </div>
  );
}

function IconLink({ label, children, href }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E0DDD5] text-[#1A1A1A] hover:bg-[#D01418] hover:border-[#D01418] hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.4 3 14.2 3c-2.6 0-4.4 1.6-4.4 4.5v2.2H7.1v3.2h2.7V21h3.7z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5A1.95 1.95 0 103.3 5.45 1.94 1.94 0 005.25 3.5ZM20.5 20.5V13.9c0-3.53-1.88-5.17-4.4-5.17a3.8 3.8 0 00-3.44 1.9h-.05V8.5H9.4c.05 1 0 12 0 12h3.38v-6.7c0-.36.03-.71.13-.97.29-.71.94-1.44 2.05-1.44 1.45 0 2.03 1.1 2.03 2.72V20.5h3.51Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 6.5l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 15l6-6M10 6l1.4-1.4a4 4 0 015.7 5.7L15.7 11.7M14 18l-1.4 1.4a4 4 0 01-5.7-5.7L8.3 12.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowBadge() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D01418]" aria-hidden="true">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function AuthorCard({ article }) {
  const { author, authorSlug, authorRole, authorImage, authorBio, authorSocial } = article;
  return (
    <div className="mt-10 flex gap-4 rounded-lg border border-[#E5E5E5] p-5">
      <ArticleImage
        imageUrl={authorImage}
        alt={author}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0"
      />
      <div className="min-w-0">
        <p className="font-sans text-xs uppercase tracking-wide text-[#A0A0A0] mb-0.5">About the Author</p>
        <h3 className="font-serif text-lg font-bold text-[#1A1A1A] break-words">
          {authorSlug ? (
            <a href={`/authors/${authorSlug}`} className="hover:text-[#D01418] transition-colors">
              {author}
            </a>
          ) : (
            author
          )}
        </h3>
        {authorRole && (
          <p className="font-sans text-xs text-[#8A8A8A] mb-2">{authorRole}</p>
        )}
        {authorBio && (
          <p className="font-sans text-sm leading-relaxed text-[#595959] break-words">
            {authorBio}
          </p>
        )}
        {authorSocial && (
          <div className="flex items-center gap-2 mt-3">
            {authorSocial.twitter && (
              <IconLink label={`${author} on Twitter`} href={authorSocial.twitter}>
                <TwitterIcon />
              </IconLink>
            )}
            {authorSocial.linkedin && (
              <IconLink label={`${author} on LinkedIn`} href={authorSocial.linkedin}>
                <LinkedinIcon />
              </IconLink>
            )}
            {authorSocial.email && (
              <IconLink label={`Email ${author}`} href={authorSocial.email}>
                <MailIcon />
              </IconLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function RelatedSidebarCard({ article }) {
  return (
    <a href={`/${article.category}/${article.slug}`} className="group flex gap-3">
      <ArticleImage
        imageUrl={article.heroImage}
        alt={article.headline}
        className="w-20 aspect-[4/3] shrink-0"
      />
      <h3 className="font-serif text-sm font-bold leading-snug text-[#1A1A1A] group-hover:text-[#D01418] transition-colors break-words">
        {article.headline}
      </h3>
    </a>
  );
}

export default async function ArticlePage({ params }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);

  if (!article) {
    notFound();
  }

  const related = getRelatedArticles(article.category, article.slug, 4);
  const categoryLabel = article.category.charAt(0).toUpperCase() + article.category.slice(1);
  const publishedLabel = formatDate(article.publishedAt);
  const updatedLabel = formatDate(article.updatedAt);
  const pageUrl = `/${article.category}/${article.slug}`;

  // ---------------------------------------------------------------------
  // JSON-LD — NewsArticle + BreadcrumbList + Organization, sourced from
  // articlesData + authorsData via the `article` object above
  // ---------------------------------------------------------------------
  const absoluteUrl = `${SITE_URL}${pageUrl}`;
  const imageUrl = getAbsoluteUrl(article.heroImage);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${absoluteUrl}#article`,
        headline: article.headline,
        description: article.dek,
        image: [imageUrl],
        datePublished: article.publishedAt || undefined,
        dateModified: article.updatedAt || article.publishedAt || undefined,
        author: {
          "@type": "Person",
          name: article.author,
          ...(article.authorSlug ? { url: `${SITE_URL}/authors/${article.authorSlug}` } : {}),
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/images/logo.png`, // ⚠️ replace with real logo
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl },
        articleSection: categoryLabel,
        keywords: article.tags.join(", "),
        ...(article.source ? { creditText: article.source } : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${absoluteUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: categoryLabel,
            item: `${SITE_URL}/${article.category}`,
          },
          { "@type": "ListItem", position: 3, name: article.headline, item: absoluteUrl },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
      },
    ],
  };

  return (
    <main className="w-full bg-white text-[#1A1A1A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main article column */}
          <article className="lg:col-span-8">
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-1.5 font-sans text-xs text-[#8A8A8A] mb-5">
              <a href="/" className="hover:text-[#D01418] transition-colors">Home</a>
              <span>/</span>
              <a href={`/${article.category}`} className="hover:text-[#D01418] transition-colors">
                {categoryLabel}
              </a>
            </nav>

            {/* Category badge */}
            <a href={`/${article.category}`} className="group inline-flex items-center gap-2 mb-4">
              <span className="font-sans text-sm font-extrabold uppercase tracking-wide text-[#D01418]">
                {categoryLabel}
              </span>
              <ArrowBadge />
            </a>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#1A1A1A] break-words">
              {article.headline}
            </h1>

            {/* Dek */}
            {article.dek && (
              <p className="mt-4 font-sans text-lg leading-relaxed text-[#595959] break-words">
                {article.dek}
              </p>
            )}

            {/* Byline + share row */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E5E5E5]">
              <div className="font-sans text-sm text-[#595959]">
                <span className="font-medium text-[#1A1A1A]">
                  By{" "}
                  {article.authorSlug ? (
                    <a
                      href={`/authors/${article.authorSlug}`}
                      className="hover:text-[#D01418] transition-colors"
                    >
                      {article.author}
                    </a>
                  ) : (
                    article.author
                  )}
                </span>
                {publishedLabel && (
                  <span className="block sm:inline sm:before:content-['_·_'] mt-1 sm:mt-0">
                    {publishedLabel}
                  </span>
                )}
                {updatedLabel && (
                  <span className="block text-xs text-[#A0A0A0] mt-1">Updated {updatedLabel}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <IconLink
                  label="Share on Facebook"
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                >
                  <FacebookIcon />
                </IconLink>
                <IconLink
                  label="Share on Twitter"
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(article.headline)}`}
                >
                  <TwitterIcon />
                </IconLink>
                <IconLink label="Copy link" href={pageUrl}>
                  <LinkIcon />
                </IconLink>
              </div>
            </div>

            {/* Hero image */}
            <figure className="mt-8">
              <ArticleImage
                imageUrl={article.heroImage}
                alt={article.headline}
                className="w-full aspect-[16/10]"
              />
              {(article.heroCaption || article.heroCredit) && (
                <figcaption className="mt-2 font-sans text-xs text-[#8A8A8A] leading-snug">
                  {article.heroCaption}
                  {article.heroCredit && (
                    <span className="text-[#B0B0B0]"> · Photo: {article.heroCredit}</span>
                  )}
                </figcaption>
              )}
            </figure>

            {/* Body — mix of headings and paragraphs */}
            <div className="mt-8">
              {article.body.map((block, i) =>
                block.type === "heading" ? (
                  <h2 key={i} className="font-serif text-2xl font-bold text-[#1A1A1A] mt-10 mb-3 break-words">
                    {block.text}
                  </h2>
                ) : (
                  <p key={i} className="font-sans text-[17px] leading-[1.8] text-[#1A1A1A] break-words mb-5">
                    {block.text}
                  </p>
                )
              )}
            </div>

            {/* Author card */}
            <AuthorCard article={article} />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <a key={tag} href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-full border border-[#E5E5E5] px-3 py-1 font-sans text-xs text-[#595959] hover:border-[#D01418] hover:text-[#D01418] transition-colors">
                    {tag}
                  </a>
                ))}
              </div>
            )}
          </article>

          {/* Sticky related-stories sidebar */}
          {related.length > 0 && (
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-6 lg:self-start">
                <h2 className="font-sans text-sm font-extrabold uppercase tracking-wide text-[#1A1A1A] mb-4 pb-3 border-b border-[#E5E5E5]">
                  Related Stories
                </h2>
                <div className="space-y-5">
                  {related.map((a) => (
                    <RelatedSidebarCard key={a.slug} article={a} />
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}