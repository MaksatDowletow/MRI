(function attachSentry() {
  const dsn = window?.mriConfig?.sentryDsn;
  if (!dsn) return;

  const script = document.createElement("script");
  script.src = "https://browser.sentry-cdn.com/7.118.0/bundle.min.js";
  script.crossOrigin = "anonymous";
  script.onload = () => {
    if (!window.Sentry) return;
    window.Sentry.init({
      dsn,
      integrations: [new window.Sentry.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  };
  document.head.appendChild(script);
})();

(function wireManualRumForwarding() {
  if (!window.telemetry) return;
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      window.telemetry.captureRum({ name: "page_hidden", value: performance.now() });
    }
  });
})();
