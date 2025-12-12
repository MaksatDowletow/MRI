const STORAGE_KEY = "mri_analytics_v1";
const DEFAULT_FUNNEL = {
  hero_cta: 0,
  form_start: 0,
  snippet_select: 0,
  report_ready: 0,
  protocol_saved: 0,
};
const VARIANTS = {
  A: { heading: "Beýni MRT hasabatlaryny kliniki logika bilen ýygna", cta: "Formany aç we başla" },
  B: { heading: "RSNA/022 boýunça hasabaty 60 sekuntda taýýarla", cta: "Hasabat döretmäge geç" },
};
export const CTA_VARIANTS = VARIANTS;

let analytics = {
  funnel: { ...DEFAULT_FUNNEL },
  variant: "A",
  variantStats: {
    A: { views: 0, clicks: 0 },
    B: { views: 0, clicks: 0 },
  },
  events: [],
};

function loadAnalytics() {
  if (typeof localStorage === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      analytics = {
        ...analytics,
        ...parsed,
        funnel: { ...DEFAULT_FUNNEL, ...parsed.funnel },
        variantStats: {
          A: { views: 0, clicks: 0, ...(parsed.variantStats?.A || {}) },
          B: { views: 0, clicks: 0, ...(parsed.variantStats?.B || {}) },
        },
      };
    } catch (e) {
      console.warn("Analytics decode failed", e);
    }
  }
}

function persist() {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      funnel: analytics.funnel,
      variant: analytics.variant,
      variantStats: analytics.variantStats,
      events: analytics.events,
    }),
  );
}

export function initAnalytics() {
  loadAnalytics();
  analytics.variant = selectVariant();
  incrementVariantViews(analytics.variant);
  trackEvent("page_view", { variant: analytics.variant });
  persist();
  return getVariantCopy();
}

export function getVariantKey() {
  return analytics.variant;
}

function selectVariant() {
  if (analytics.variant === "A" || analytics.variant === "B") return analytics.variant;
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("mri_cta_variant") : null;
  if (stored === "A" || stored === "B") return stored;
  const chosen = Math.random() > 0.5 ? "A" : "B";
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("mri_cta_variant", chosen);
  }
  return chosen;
}

function incrementVariantViews(variant) {
  analytics.variantStats[variant].views += 1;
}

export function recordCtaClick() {
  analytics.variantStats[analytics.variant].clicks += 1;
  trackEvent("cta_click", { variant: analytics.variant });
  persist();
}

export function getVariantCopy() {
  return VARIANTS[analytics.variant];
}

export function recordFunnelStep(step, payload = {}) {
  if (!Object.hasOwn(DEFAULT_FUNNEL, step)) return;
  analytics.funnel[step] = (analytics.funnel[step] || 0) + 1;
  trackEvent(`funnel_${step}`); 
  if (payload.variant) {
    trackEvent(`variant_${payload.variant}_${step}`);
  }
  persist();
}

export function trackEvent(name, payload = {}) {
  analytics.events.unshift({
    name,
    payload,
    at: new Date().toISOString(),
  });
  analytics.events = analytics.events.slice(0, 25);
  persist();
}

export function getFunnelReport() {
  const steps = Object.entries(DEFAULT_FUNNEL).map(([key]) => ({
    id: key,
    count: analytics.funnel[key] || 0,
  }));

  const drops = steps.map((step, index) => {
    if (index === 0) return { drop: 0, from: null, to: step.id };
    const prev = steps[index - 1];
    return { drop: Math.max(0, (prev.count || 0) - (step.count || 0)), from: prev.id, to: step.id };
  });

  const biggestDrop = drops.reduce((max, current) => (current.drop > (max?.drop || 0) ? current : max), {
    drop: 0,
    from: null,
    to: null,
  });

  return {
    steps,
    biggestDrop,
    variantStats: analytics.variantStats,
    variant: analytics.variant,
  };
}
