"use client";

import { useState } from "react";

/**
 * Footer — companion to Header.jsx (white bg, matches header palette)
 *   Top: gold rule + compact masthead + tagline
 *   Mid: 4-column grid — Sections, Company, Follow Us, Newsletter
 *   Bottom bar: copyright, legal links, language switch
 *
 * Palette (matches header):
 *   masthead-red  #D01418
 *   gold rule     #E8B23D
 *   ink           #1A1A1A   (text)
 *   ink-soft      #595959   (secondary text)
 *   rule          #E5E5E5   (hairlines)
 */

const SECTIONS = ["Business", "Politics", "Technology", "Health", "Lifestyle", "Sports"];

const COMPANY_LINKS = ["About Us", "Careers", "Contact", "Advertise With Us", "Newsroom Ethics"];

const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"];

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.4 3 14.2 3c-2.6 0-4.4 1.6-4.4 4.5v2.2H7.1v3.2h2.7V21h3.7z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 5.9c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.6a4.1 4.1 0 0 0 1.3 5.5c-.7 0-1.3-.2-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.1 4.1 0 0 1-1.9.1 4.1 4.1 0 0 0 3.8 2.9A8.2 8.2 0 0 1 2 18.4a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.3 11.7-11.7v-.5c.8-.6 1.5-1.3 2-2.1z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5.5" width="20" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.3v5.4l5-2.7-5-2.7z" fill="currentColor" />
    </svg>
  );
}

function SocialIcon({ label, href = "#", children }) {
  return (
    <a href={href} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8D8D8] text-[#1A1A1A] hover:border-[#D01418] hover:text-[#D01418] transition-colors">
      {children}
    </a>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="font-sans text-[12px] font-semibold uppercase tracking-[0.15em] text-[#8A8A8A] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <footer className="w-full max-w-[100vw] overflow-x-hidden bg-white text-[#1A1A1A]">
      {/* top gold rule */}
      <div className="h-[3px] w-full bg-[#E8B23D]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* masthead */}
        <div className="flex flex-col items-center text-center pt-10 pb-8 border-b border-[#E5E5E5]">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#D01418]">GLOBAL TIMES</span>
          <span className="mt-2 text-[10px] tracking-[0.18em] text-[#8A8A8A] font-sans">DISCOVER CHINA, DISCOVER THE WORLD</span>
        </div>

        {/* link grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          <FooterColumn title="Sections">
            <ul className="space-y-2.5 font-sans text-sm text-[#595959]">
              {SECTIONS.map((label) => (
                <li key={label}>
                  <a href={`/${label.toLowerCase()}`} className="hover:text-[#D01418] transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Company">
            <ul className="space-y-2.5 font-sans text-sm text-[#595959]">
              {COMPANY_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-[#D01418] transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Follow Us">
            <div className="flex items-center gap-3">
              <SocialIcon label="Facebook"><FacebookIcon /></SocialIcon>
              <SocialIcon label="Twitter"><TwitterIcon /></SocialIcon>
              <SocialIcon label="Instagram"><InstagramIcon /></SocialIcon>
              <SocialIcon label="YouTube"><YoutubeIcon /></SocialIcon>
            </div>
          </FooterColumn>

          <div className="col-span-2 lg:col-span-1">
            <FooterColumn title="Newsletter">
              <p className="font-sans text-sm text-[#595959] mb-4">
                Top stories, once a day, in your inbox.
              </p>
              {submitted ? (
                <p className="font-sans text-sm text-[#B8860B]">You're subscribed. Thanks!</p>
              ) : (
                <form onSubmit={handleSubmit} className="flex">
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="min-w-0 flex-1 rounded-l-sm border border-[#D8D8D8] bg-white px-3 py-2 font-sans text-sm text-[#1A1A1A] placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#D01418]"
                  />
                  <button type="submit" className="shrink-0 rounded-r-sm bg-[#D01418] px-4 py-2 font-sans text-sm font-medium text-white hover:bg-[#b01115] transition-colors">
                    Sign up
                  </button>
                </form>
              )}
            </FooterColumn>
          </div>
        </div>

        {/* bottom bar */}
        <div className="flex flex-col gap-4 border-t border-[#E5E5E5] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-[#8A8A8A] order-2 sm:order-1">
            © {new Date().getFullYear()} Global Times. All rights reserved.
          </p>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 order-1 sm:order-2">
            {LEGAL_LINKS.map((label) => (
              <a key={label} href="#" className="font-sans text-xs text-[#8A8A8A] hover:text-[#D01418] transition-colors">
                {label}
              </a>
            ))}
            <a href="#" className="font-sans text-xs text-[#8A8A8A] hover:text-[#D01418] transition-colors">中文</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}