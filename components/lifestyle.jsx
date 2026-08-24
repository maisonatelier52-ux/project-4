import articlesData from "../public/data/article.json";

/**
 * LifestyleSection — "Lifestyle" homepage photo rail
 *
 * Same horizontal scroll-snap gallery pattern as the original PhotoSpotlight
 * concept, now wired to real lifestyle articles instead of placeholder
 * captions.
 *
 * Data source: public/data/articles.json — reads only the "lifestyle"
 * category, sorted by publishedAt (newest first). Unlike the grid-based
 * category sections, this is a horizontal scroll, so there's no fixed slot
 * count to worry about — every lifestyle article gets a card, each used
 * exactly once (no repeats), in one pass over the sorted list.
 *
 * Palette:
 *   ink        #1A1A1A   (section background)
 *   masthead-red #D01418 (accent / camera icon)
 *   paper      #FAFAF7   (headline text on dark bg)
 *   ink-soft-light #B8B8B8 (caption text on dark bg)
 */

const CATEGORY_SLUG = "lifestyle";

function getLifestyleArticles() {
  const posts = articlesData[CATEGORY_SLUG] || [];
  return [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function ImagePlaceholder({ label, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#2A2A2A] text-[#7A7A7A] font-sans text-[11px] uppercase tracking-wide ${className}`}
      aria-label={`${label} image placeholder`}
    >
      {label}
    </div>
  );
}

// Sizing classes go on the outer wrapper; the <img> just fills it.
function PhotoImage({ imageUrl, alt, className = "" }) {
  if (!imageUrl) {
    return <ImagePlaceholder label={alt || "photo"} className={className} />;
  }
  return (
    <div className={`overflow-hidden max-w-full ${className}`}>
      <img src={imageUrl} alt={alt} className="block w-full h-full object-cover" />
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.5h3l1.5-2h7L17 8.5h3a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 18v-8A1.5 1.5 0 014 8.5z"
        stroke="#D01418"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.5" r="3.2" stroke="#D01418" strokeWidth="1.6" />
    </svg>
  );
}

function PhotoCard({ article, index, total }) {
  const href = `/${CATEGORY_SLUG}/${article.slug}`;
  return (
    <a href={href} className="group relative shrink-0 w-[78%] sm:w-[46%] lg:w-[31%] snap-start overflow-hidden">
      <PhotoImage
        imageUrl={article.heroImage}
        alt={article.headline}
        className="w-full aspect-[4/5] sm:aspect-[3/4]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <span className="absolute top-3 left-3 font-mono text-[11px] text-white/80 tracking-wide">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <p className="absolute bottom-0 left-0 right-0 p-4 font-sans text-base sm:text-lg leading-snug text-white group-hover:text-[#F2B8B8] transition-colors">
        {article.headline}
      </p>
    </a>
  );
}

export default function LifestyleSection() {
  const articles = getLifestyleArticles();

  if (articles.length === 0) {
    return null; // no lifestyle articles yet — nothing to show
  }

  return (
    <section className="w-full max-w-[100vw] overflow-x-hidden bg-[#1A1A1A] text-[#FAFAF7]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CameraIcon />
            <h2 className="font-sans text-xl font-extrabold uppercase tracking-wide text-[#FAFAF7]">Lifestyle</h2>
          </div>
          <a href={`/${CATEGORY_SLUG}`} className="hidden sm:block font-sans text-sm text-[#B8B8B8] hover:text-white transition-colors">
            View all →
          </a>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {articles.map((article, i) => (
            <PhotoCard key={article.slug} article={article} index={i} total={articles.length} />
          ))}
        </div>
      </div>
    </section>
  );
}