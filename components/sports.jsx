import articlesData from "../public/data/article.json";

/**
 * SportsSection — the "SPORTS" homepage block
 *
 * Same numbered-ranking-list pattern as the original TrendingSection
 * concept, now wired to real sports articles instead of placeholder ones.
 *
 * Layout:
 *   Header : "SPORTS" + red flame icon, hairline above
 *   Grid   : 6 items, 1 col mobile -> 2 col sm -> 3 col lg
 *            each item: oversized outline numeral + small thumbnail + headline
 *
 * Data source: public/data/articles.json — reads only the "sports"
 * category, sorted by publishedAt (newest first). This layout has 6 slots;
 * the 6 most recent sports articles fill them, each used exactly once, so
 * nothing repeats. With 7 sports articles in the data file today, the
 * oldest one simply doesn't appear here — this is a homepage showcase, not
 * the full category listing (that's app/sports/page.jsx, which shows all
 * of them).
 *
 * Palette (matches the rest of the site):
 *   masthead-red  #D01418
 *   ink           #1A1A1A
 *   ink-soft      #595959
 *   rule          #E5E5E5
 *   numeral-ghost #EDEDED   (the big outline number, kept quiet so it doesn't compete with the headline)
 */

const CATEGORY = "Sports";
const CATEGORY_SLUG = "sports";

function getSportsArticles() {
  const posts = articlesData[CATEGORY_SLUG] || [];
  return [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function ImagePlaceholder({ label, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#EDEDED] text-[#A0A0A0] font-sans text-[10px] uppercase tracking-wide ${className}`}
      aria-label={`${label} image placeholder`}
    >
      {label}
    </div>
  );
}

// Sizing classes go on the outer wrapper; the <img> just fills it.
function StoryImage({ imageUrl, alt, className = "" }) {
  if (!imageUrl) {
    return <ImagePlaceholder label={alt || "image"} className={className} />;
  }
  return (
    <div className={`overflow-hidden max-w-full shrink-0 ${className}`}>
      <img src={imageUrl} alt={alt} className="block w-full h-full object-cover" />
    </div>
  );
}

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2c1 3-2 4-2 7a4 4 0 108 0c0-1.2-.5-2-1-2.5.6 2-1 3-2 3-1.5 0-2-1.2-1.5-2.5C14 6 13 4 12 2zM8.5 14A3.5 3.5 0 0012 17.5 3.5 3.5 0 0015.5 14c0-.6-.1-1-.3-1.4-.4.9-1.3 1.4-2.2 1.4-1.4 0-2.5-1.1-2.5-2.5 0-.3 0-.6.1-.9C9.4 11.3 8.5 12.5 8.5 14z"
        fill="#D01418"
      />
    </svg>
  );
}

function SportsCard({ article, rank }) {
  const href = `/${CATEGORY_SLUG}/${article.slug}`;
  return (
    <a href={href} className="group flex items-center gap-4 py-5 border-b border-[#E5E5E5]">
      <span
        className="shrink-0 font-serif text-5xl font-bold leading-none text-transparent select-none"
        style={{ WebkitTextStroke: "1.5px #A3A3A3" }}
        aria-hidden="true"
      >
        {String(rank).padStart(2, "0")}
      </span>

      <StoryImage
        imageUrl={article.heroImage}
        alt={article.headline}
        className="w-16 h-16 sm:w-20 sm:h-20"
      />

      <h3 className="flex-1 font-serif text-base sm:text-lg font-bold leading-snug text-[#1A1A1A] group-hover:text-[#D01418] transition-colors break-words">
        {article.headline}
      </h3>
    </a>
  );
}

export default function SportsSection() {
  const sorted = getSportsArticles();
  const topArticles = sorted.slice(0, 6); // most recent 6 — no repeats, single pass

  if (topArticles.length === 0) {
    return null; // no sports articles yet — nothing to show
  }

  return (
    <section className="w-full max-w-[100vw] overflow-x-hidden bg-white text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 border-t border-[#E5E5E5]">
        <div className="flex items-center gap-2 mb-6">
          <FlameIcon />
          <h2 className="font-sans text-xl font-extrabold uppercase tracking-wide text-[#1A1A1A]">
            {CATEGORY}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
          {topArticles.map((article, i) => (
            <SportsCard key={article.slug} article={article} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}