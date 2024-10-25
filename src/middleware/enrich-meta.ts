import type { MiddlewareFunction } from "../core/run-middlewares";

export function createEnrichMetaMiddleware(
  extra?: Record<string, unknown>
): MiddlewareFunction {
  return async (event, services, next) => {
    if (!event.meta) {
      event.meta = {};
    }
    event.meta = {
      ...event.meta,
      ...extra,
      ...getMeta(),
    };

    await next();
  };
}

function getMeta(): Record<string, unknown> {
  const url = new URL(window.location.href);

  const campaign = getCampaign(url.searchParams);
  const page = {
    path: window.location.pathname,
    referrer: document.referrer,
    search: window.location.search,
    title: document.title,
    url: window.location.href,
  };
  const browser = {
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    language: navigator.language,
    platform: navigator.platform,
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  return { campaign, page, browser };
}

function getCampaign(search: URLSearchParams) {
  return Object.fromEntries(
    Array.from(search.entries())
      .filter(([k, v]) => k.startsWith("utm_"))
      .map(([k, v]) => [k.replace("utm_", ""), v])
  );
}
