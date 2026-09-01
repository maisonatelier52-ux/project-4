import articlesData from "../public/data/article.json";

/**
 * WorldSection — the "WORLD" category block for the homepage
 *   Left    : two stacked stories — image above headline, no excerpt
 *   Center  : one large main story — big image, headline, excerpt
 *   Right   : three stacked text-only stories, separated by dividers
 *
 * Data source: public/data/articles.json — reads only the "world"
 * category, sorted by publishedAt (newest first). This layout has 6 slots
 * (2 left + 1 main + 3 text-only); the 6 most recent world articles
 * fill them, each used exactly once, so nothing repeats. If there are more
 * than 6 world articles in the data file, the oldest ones simply don't
 * appear here — this is a homepage showcase, not the full category listing
 * (that's app/world/page.jsx, which shows all of them).
 *
 * Palette (matches header/footer/other homepage sections):
 *   masthead-red  #D01418
 *   ink           #1A1A1A
 *   ink-soft      #595959
 *   rule          #E5E5E5
 */

const CATEGORY = "World";
const CATEGORY_SLUG = "world";
const CATEGORY_HREF = `/${CATEGORY_SLUG}`;

function getWorldArticles() {
  const posts = articlesData[CATEGORY_SLUG] || [];
  return [...posts].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
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

// Sizing classes go on the outer wrapper; the <img> just fills it.
function StoryImage({ imageUrl, alt, className = "" }) {
  if (!imageUrl) {
    return <ImagePlaceholder label={alt || "image"} className={className} />;
  }
  return (
    <div className={`overflow-hidden max-w-full ${className}`}>
      <img src={imageUrl} alt={alt} className="block w-full h-full object-cover" />
    </div>
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

function Divider() {
  return <hr className="border-t border-[#E5E5E5] my-5" />;
}

function LeftStory({ article }) {
  const href = `/${CATEGORY_SLUG}/${article.slug}`;
  return (
    <a href={href} className="group block">
      <StoryImage
        imageUrl={article.heroImage}
        alt={article.headline}
        className="w-full aspect-[16/9] mb-3"
      />
      <h3 className="font-serif text-lg font-bold leading-snug text-[#1A1A1A] group-hover:text-[#D01418] transition-colors break-words">
        {article.headline}
      </h3>
    </a>
  );
}

function MainStory({ article }) {
  const href = `/${CATEGORY_SLUG}/${article.slug}`;
  return (
    <a href={href} className="group block">
      <StoryImage
        imageUrl={article.heroImage}
        alt={article.headline}
        className="w-full aspect-[16/10] mb-4"
      />
      <h3 className="font-serif text-4xl font-bold leading-snug text-[#1A1A1A] group-hover:text-[#D01418] transition-colors break-words">
        {article.headline}
      </h3>
      <p className="mt-3 font-sans text-sm leading-relaxed text-[#595959] break-words">
        {article.dek}
      </p>
    </a>
  );
}

function TextStory({ article }) {
  const href = `/${CATEGORY_SLUG}/${article.slug}`;
  return (
    <a href={href} className="group block">
      <h3 className="font-serif text-lg font-bold leading-snug text-[#1A1A1A] group-hover:text-[#D01418] transition-colors break-words">
        {article.headline}
      </h3>
      {article.dek && (
        <p className="mt-2 font-sans text-sm leading-relaxed text-[#595959] break-words">
          {article.dek}
        </p>
      )}
    </a>
  );
}

export default function WorldSection() {
  const sorted = getWorldArticles();

  // Each article used exactly once across these three slices — no repeats.
  const leftArticles = sorted.slice(0, 2); // 2 stories
  const mainArticle = sorted[2];
  const textArticles = sorted.slice(3, 6); // 3 stories

  if (!mainArticle) {
    return null; // no world articles yet — nothing to show
  }

  return (
    <section className="w-full max-w-[100vw] overflow-x-hidden bg-white text-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 border-t border-[#E5E5E5]">
        <a href={CATEGORY_HREF} className="group inline-flex items-center gap-2 mb-6">
          <h2 className="font-sans text-xl font-extrabold uppercase tracking-wide text-[#1A1A1A]">
            {CATEGORY}
          </h2>
          <ArrowBadge />
        </a>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left — two stories with images, no excerpt */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {leftArticles.map((article, i) => (
              <div key={article.slug}>
                <LeftStory article={article} />
                {i < leftArticles.length - 1 && <Divider />}
              </div>
            ))}
          </div>

          {/* Center — main story */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <MainStory article={mainArticle} />
          </div>

          {/* Right — text-only stories */}
          <div className="lg:col-span-4 order-3">
            {textArticles.map((article, i) => (
              <div key={article.slug}>
                <TextStory article={article} />
                {i < textArticles.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}