import { useEffect } from "react";

const SITE_NAME = "Khatu Pixel Digital Studio";
const DEFAULT_DESCRIPTION =
  "Khatu Pixel Digital Studio — photography, videography, and customised gifts. Capturing moments, creating memories.";

/**
 * Sets the browser tab title and the description/OG/Twitter meta tags for
 * the current page. This is a client-only SPA (see index.html) — every
 * route starts out with the exact same <head>, so without this every page
 * (Studio, a specific product, Portfolio…) would share one generic title
 * and description in the browser tab, in bookmarks, and in link previews
 * on WhatsApp/social. This hook is what differentiates them once React
 * mounts.
 *
 * Runs on every render where `title`/`description` change (not just mount)
 * so a page whose title depends on async data — a product or service name —
 * updates once that data arrives, instead of being stuck on a loading-state
 * title. Pass `undefined` for `title` to skip updating (e.g. while a detail
 * page is still loading and has nothing meaningful to show yet).
 */
export function usePageMeta(title: string | undefined, description: string = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    if (!title) return;
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', fullTitle);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[name="twitter:title"]', fullTitle);
    setMetaContent('meta[name="twitter:description"]', description);
  }, [title, description]);
}

function setMetaContent(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute("content", content);
}
