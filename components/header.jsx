"use client";

import { useEffect, useState } from "react";
import articlesData from "../public/data/article.json";

/**
 * Header — masthead layout
 *   Row 1: social icons (left) — centered serif masthead with gold rules — newsletter / subscribe / search (right)
 *   Row 2 (desktop, md+): category nav shown inline, no menu button
 *   Mobile (<md): only a menu button — opens a sliding drawer with all categories
 *
 * Polish pass:
 *   - Nav links get an animated underline on hover instead of just a color change
 *   - Subscribe is now a filled red button (was outline) for more visual weight
 *   - Social icons: bordered circles that fill solid red + lift slightly on hover
 *   - Search/menu icons sit in a soft hover circle
 *   - Masthead scales up very slightly on hover for a bit of life
 *
 * Search: clicking the search icon (desktop or mobile) opens a dropdown
 * panel with a text input. Typing live-filters every article across all 6
 * categories in public/data/articles.json (matching on headline or dek),
 * showing up to 8 results that link straight to the matching article.
 *
 * Fonts (add to app/layout.jsx):
 *   Masthead : a high-contrast serif, e.g. "Playfair Display" -> font-serif
 *   Nav/body : a clean grotesque, e.g. "Inter"                -> font-sans
 *
 * Palette:
 *   masthead-red  #D01418
 *   gold rule     #E8B23D
 *   ink           #1A1A1A
 *   ink-soft      #595959   (nav links)
 *   rule          #E5E5E5   (hairlines)
 */

const NAV_LINKS = ["Business", "Politics", "Technology", "Health", "Lifestyle", "Sports"];

// Flattens articles.json (grouped by category) into one searchable list.
function getAllArticles() {
  const all = [];
  for (const category of Object.keys(articlesData)) {
    for (const post of articlesData[category]) {
      all.push({ category, ...post });
    }
  }
  return all;
}

const ALL_ARTICLES = getAllArticles();

function searchArticles(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_ARTICLES.filter(
    (a) =>
      a.headline.toLowerCase().includes(q) ||
      (a.dek && a.dek.toLowerCase().includes(q))
  ).slice(0, 8);
}

function IconButton({ label, children, href = "#", onClick }) {
  const className =
    "flex h-8 w-8 items-center justify-center rounded-full text-[#1A1A1A] hover:bg-[#F5EEDD] hover:text-[#D01418] transition-colors";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={label} className={className}>
        {children}
      </button>
    );
  }

  return (
    <a href={href} aria-label={label} className={className}>
      {children}
    </a>
  );
}

// Bordered circle treatment for the social row — fills solid red on hover
// instead of just a tinted background, a bit more premium than IconButton.
function SocialIconButton({ label, children, href = "#" }) {
  return (
    <a href={href} aria-label={label} className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-[#E0DDD5] text-[#1A1A1A] hover:bg-[#D01418] hover:border-[#D01418] hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      {children}
    </a>
  );
}

function MobileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:w-5 sm:h-5">
      <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <line x1="10.5" y1="18.3" x2="13.5" y2="18.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="sm:w-[18px] sm:h-[18px]">
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.4 3 14.2 3c-2.6 0-4.4 1.6-4.4 4.5v2.2H7.1v3.2h2.7V21h3.7z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="sm:w-[18px] sm:h-[18px]">
      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="sm:w-[19px] sm:h-[19px]">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <line x1="21" y1="21" x2="16.2" y2="16.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function toggleSearch() {
    setSearchOpen((open) => !open);
    setQuery("");
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  const results = searchArticles(query);

  return (
    <header className="w-full max-w-[100vw] overflow-x-hidden bg-white text-[#1A1A1A]">
      {/* Row 1 — social / masthead / account */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center py-3 sm:py-5">
          {/* left — social icons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <SocialIconButton label="App"><MobileIcon /></SocialIconButton>
            <SocialIconButton label="Facebook"><FacebookIcon /></SocialIconButton>
            <SocialIconButton label="Twitter"><TwitterIcon /></SocialIconButton>
          </div>

          {/* center — masthead */}
          <a href="/" className="group flex justify-center select-none min-w-0" aria-label="Global Times — home">
            <div className="flex flex-col items-center w-full max-w-[220px] sm:max-w-none transition-transform duration-300 ease-out group-hover:scale-[1.03]">
              <div className="h-[2.5px] sm:h-[5px] w-full bg-[#E8B23D]" />
              <span className="font-serif leading-[0.95] text-center text-[#D01418] text-lg xs:text-xl sm:text-3xl md:text-4xl font-bold tracking-tight py-3 whitespace-nowrap">
                GLOBAL TIMES
              </span>
              <div className="h-[2.5px] sm:h-[5px] w-full bg-[#E8B23D]" />
              <span className="mt-1 text-center text-[7px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.2em] text-[#8A8A8A] font-sans leading-tight">
                DISCOVER CHINA, DISCOVER THE WORLD
              </span>
            </div>
          </a>

          {/* right — newsletter / subscribe / search (desktop) */}
          <div className="hidden md:flex items-center justify-end gap-5 font-sans text-sm">
            <a href="/newsletter" className="relative text-[#1A1A1A] hover:text-[#D01418] transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[1.5px] after:w-0 after:bg-[#D01418] after:transition-all after:duration-300 hover:after:w-full">
              Newsletter
            </a>
            <a href="/subscribe" className="rounded-full bg-[#D01418] px-5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[#a80f13] hover:shadow-md transition-all">
              Subscribe
            </a>
            <IconButton label={searchOpen ? "Close search" : "Search"} onClick={toggleSearch}>
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          </div>

          {/* right — search + menu trigger (mobile) */}
          <div className="flex md:hidden items-center justify-end gap-1 sm:gap-2">
            <IconButton label={searchOpen ? "Close search" : "Search"} onClick={toggleSearch}>
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#1A1A1A] hover:bg-[#F5EEDD] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D01418] focus-visible:ring-offset-2"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Search dropdown panel */}
      {searchOpen && (
        <div className="border-t border-[#E5E5E5] bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && closeSearch()}
              placeholder="Search articles..."
              className="w-full border border-[#E5E5E5] rounded-sm px-4 py-2 font-sans text-sm text-[#1A1A1A] focus:outline-none focus:border-[#D01418]"
            />

            {query.trim() && (
              <div className="mt-3 max-h-80 overflow-y-auto divide-y divide-[#E5E5E5]">
                {results.length === 0 ? (
                  <p className="py-4 font-sans text-sm text-[#8A8A8A]">
                    No results for &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  results.map((article) => (
                    <a
                      key={`${article.category}-${article.slug}`}
                      href={`/${article.category}/${article.slug}`}
                      onClick={closeSearch}
                      className="flex items-center justify-between gap-4 py-3 hover:bg-[#F7F5EF] transition-colors"
                    >
                      <span className="font-sans text-sm text-[#1A1A1A]">{article.headline}</span>
                      <span className="shrink-0 font-sans text-[10px] font-bold uppercase tracking-wide text-[#D01418]">
                        {article.category}
                      </span>
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Row 2 — category nav, desktop only, no menu button needed */}
      <div className="hidden md:block border-t border-b border-[#E5E5E5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-center gap-6 lg:gap-10 h-14 font-sans text-[13px] font-medium tracking-wide text-[#2d2b2b]">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={`/${label.toLowerCase()}`}
                className="relative uppercase py-1 hover:text-[#D01418] transition-colors after:absolute after:left-1/2 after:-bottom-[1px] after:h-[2px] after:w-0 after:-translate-x-1/2 after:bg-[#D01418] after:transition-all after:duration-300 hover:after:w-full"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile sliding drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        {/* backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-black/40"
        />

        {/* panel */}
        <div
          className={`absolute top-0 left-0 h-full w-[78%] max-w-xs bg-white shadow-2xl transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between px-5 h-16 border-b border-[#E5E5E5]">
            <span className="font-serif text-lg font-bold text-[#D01418]">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#1A1A1A] hover:bg-[#F5EEDD] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D01418] focus-visible:ring-offset-2"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex flex-col px-5 py-2">
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={`/${label.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="py-3 border-b border-[#E5E5E5] last:border-none font-sans text-sm font-medium uppercase tracking-wide text-[#1A1A1A] hover:text-[#D01418] hover:pl-1 transition-all"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 px-5 pt-4">
            <a href="/newsletter" className="text-sm hover:text-[#D01418] transition-colors">Newsletter</a>
            <a href="/subscribe" className="rounded-full bg-[#D01418] px-5 py-1.5 text-sm font-medium text-white hover:bg-[#a80f13] transition-colors">
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}