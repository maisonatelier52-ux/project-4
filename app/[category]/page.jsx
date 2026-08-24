// Adjust this path if this file moves relative to /public/data
import articlesData from "../../public/data/article.json";

/**
 * app/[category]/page.jsx — category archive page
 *
 * Route example: /business
 *
 * Layout:
 *   Breadcrumb -> category header -> uniform grid of articles
 *
 * Data source: public/data/articles.json — the same file used by
 * app/[category]/[slug]/page.jsx and app/authors/[author]/page.jsx, so all
 * three pages now share one source of truth. getArticlesByCategory reads
 * post.dek as the listing excerpt (the full article body/author data isn't
 * needed here). Swap it for a real fetch call when ready — the JSX below
 * doesn't need to change.
 *
 * Next.js note: `params` is async in the App Router (Next 15+), so it's
 * awaited before use below.
 *
 * Palette (matches the rest of the site):
 *   masthead-red  #D01418
 *   ink           #1A1A1A
 *   ink-soft      #595959
 *   rule          #E5E5E5
 */

const CATEGORY_LABELS = {
  business: "Business",
  politics: "Politics",
  technology: "Technology",
  health: "Health",
  lifestyle: "Lifestyle",
  sports: "Sports",
};

// Swap this for: const res = await fetch(`${API_URL}/articles?category=${category}&page=${page}`)
function getArticlesByCategory(category) {
  const posts = articlesData[category?.toLowerCase()] || [];

  return posts
    .map((post) => ({
      category: category.toLowerCase(),
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
  const { category } = await params;
  const label = CATEGORY_LABELS[category?.toLowerCase()] || category;
  return {
    title: `${label} News | Global Times`,
    description: `The latest ${label} coverage from Global Times.`,
  };
}

function ImagePlaceholder({ label, className = "" }) {
  return (
    <div className={`flex items-center justify-center bg-[#EDEDED] text-[#A0A0A0] font-sans text-[11px] uppercase tracking-wide ${className}`} aria-label={`${label} image placeholder`}>
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

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const label = CATEGORY_LABELS[category?.toLowerCase()] || category;
  const articles = getArticlesByCategory(category);

  return (
    <main className="w-full max-w-[100vw] overflow-x-hidden bg-white text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1.5 font-sans text-xs text-[#8A8A8A] mb-6">
          <a href="/" className="hover:text-[#D01418] transition-colors">Home</a>
          <span>/</span>
          <span className="text-[#1A1A1A]">{label}</span>
        </nav>

        {/* Category header — badge box sits inside a lighter background panel */}
        <div className="bg-[#F7F5EF] px-6 py-6 sm:px-8 sm:py-8 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-block bg-[#D01418] px-6 py-3 shadow-sm">
              <h1 className="font-sans text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white">
                {label}
              </h1>
            </div>
            <span className="font-sans text-sm text-[#8A8A8A]">
              {articles.length} {articles.length === 1 ? "story" : "stories"}
            </span>
          </div>
          <div className="h-[3px] w-16 bg-[#E8B23D] mt-2" />
        </div>

        {articles.length === 0 ? (
          <p className="font-sans text-[#595959]">No stories in this category yet. Check back soon.</p>
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