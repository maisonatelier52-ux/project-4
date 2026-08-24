import { notFound } from "next/navigation";

// Adjust these paths if this file moves relative to /public/data
import articlesData from "../../../public/data/article.json";
import authorsData from "../../../public/data/author.json";

/**
 * app/authors/[author]/page.jsx — author profile page
 *
 * Route example: /authors/james-carter
 *
 * Layout:
 *   Breadcrumb -> author header (avatar, name, role, bio, social links) ->
 *   uniform grid of that author's articles (same card style/size as the
 *   category page, for visual consistency across the site)
 *
 * Data source: public/data/authors.json + public/data/articles.json — the
 * same two files used by app/[category]/[slug]/page.jsx, so author info
 * only needs to be edited in one place. Each author has a `category` field
 * in authors.json, so getArticlesByAuthor looks up that one category's
 * article list directly instead of scanning every category. Swap these for
 * real API/CMS calls later — the JSX doesn't change as long as the
 * returned shapes match.
 *
 * Next.js note: `params` is async in the App Router (Next 15+), so it's
 * awaited before use below.
 *
 * Palette (matches the rest of the site):
 *   masthead-red  #D01418
 *   gold rule     #E8B23D
 *   ink           #1A1A1A
 *   ink-soft      #595959
 *   rule          #E5E5E5
 */

// Swap this for: const res = await fetch(`${API_URL}/authors/${authorSlug}`)
function getAuthorBySlug(authorSlug) {
  const info = authorsData[authorSlug?.toLowerCase()];
  return info ? { slug: authorSlug.toLowerCase(), ...info } : null;
}

// Uses the author's own `category` field (from authors.json) to go straight
// to that category's article list, instead of scanning every category.
// Swap this for: const res = await fetch(`${API_URL}/articles?author=${authorSlug}`)
function getArticlesByAuthor(authorSlug, category) {
  const slug = authorSlug?.toLowerCase();
  const posts = articlesData[category] || [];

  return posts
    .filter((post) => post.authorSlug === slug)
    .map((post) => ({
      category,
      slug: post.slug,
      headline: post.headline,
      excerpt: post.dek,
      heroImage: post.heroImage,
      publishedAt: post.publishedAt,
    }))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const { author } = await params;
  const authorData = getAuthorBySlug(author);

  if (!authorData) {
    return { title: "Author not found" };
  }

  return {
    title: `${authorData.name} | Global Times`,
    description: authorData.bio,
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

function ArticleCard({ article }) {
  const dateLabel = formatDate(article.publishedAt);
  return (
    <a href={`/${article.category}/${article.slug}`} className="group block">
      <ArticleImage
        imageUrl={article.heroImage}
        alt={article.headline}
        className="w-full aspect-[4/3] mb-3"
      />
      <h3 className="font-serif text-lg font-bold leading-snug text-[#1A1A1A] group-hover:text-[#D01418] transition-colors break-words">
        {article.headline}
      </h3>
      <p className="mt-2 font-sans text-sm leading-relaxed text-[#595959] break-words line-clamp-2">
        {article.excerpt}
      </p>
      {dateLabel && (
        <p className="mt-2 font-sans text-xs text-[#A0A0A0]">{dateLabel}</p>
      )}
    </a>
  );
}

export default async function AuthorPage({ params }) {
  const { author } = await params;
  const authorData = getAuthorBySlug(author);

  if (!authorData) {
    notFound();
  }

  const articles = getArticlesByAuthor(author, authorData.category);

  return (
    <main className="w-full max-w-[100vw] overflow-x-hidden bg-white text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 font-sans text-xs text-[#8A8A8A] mb-6">
          <a href="/" className="hover:text-[#D01418] transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/authors" className="hover:text-[#D01418] transition-colors">
            Authors
          </a>
          <span>/</span>
          <span className="text-[#1A1A1A]">{authorData.name}</span>
        </nav>

        {/* Author header — lighter background panel, matching the category page pattern */}
        <div className="bg-[#F7F5EF] px-6 py-8 sm:px-10 sm:py-10 mb-10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          <ArticleImage
            imageUrl={authorData.avatarImage}
            alt={authorData.name}
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full shrink-0"
          />
          <div className="min-w-0">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] break-words">
              {authorData.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {authorData.category && (
                <a
                  href={`/${authorData.category}`}
                  className="rounded-full bg-[#D01418] px-3 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#a80f13] transition-colors"
                >
                  {authorData.category}
                </a>
              )}
              {authorData.role && (
                <p className="font-sans text-sm text-[#8A8A8A]">{authorData.role}</p>
              )}
            </div>
            {authorData.bio && (
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#595959] break-words max-w-2xl">
                {authorData.bio}
              </p>
            )}
            <div className="flex items-center gap-3 mt-4">
              {authorData.social?.twitter && (
                <IconLink label={`${authorData.name} on Twitter`} href={authorData.social.twitter}>
                  <TwitterIcon />
                </IconLink>
              )}
              {authorData.social?.linkedin && (
                <IconLink label={`${authorData.name} on LinkedIn`} href={authorData.social.linkedin}>
                  <LinkedinIcon />
                </IconLink>
              )}
              {authorData.social?.email && (
                <IconLink label={`Email ${authorData.name}`} href={authorData.social.email}>
                  <MailIcon />
                </IconLink>
              )}
            </div>
          </div>
        </div>

        {/* Articles by this author */}
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-sans text-lg font-extrabold uppercase tracking-wide text-[#1A1A1A]">
            Articles
          </h2>
          <span className="font-sans text-sm text-[#8A8A8A]">
            {articles.length} {articles.length === 1 ? "story" : "stories"}
          </span>
        </div>

        {articles.length === 0 ? (
          <p className="font-sans text-[#595959]">No stories from this author yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}