import posthog from "posthog-js";

const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY ?? "";

// Analytics stays off until a real project key is set, so local dev and preview
// builds without one send nothing.
export const analyticsEnabled = key !== "" && !key.includes("placeholder");

if (analyticsEnabled) {
  posthog.init(key, {
    // Same-origin path rewritten to PostHog (vercel.json, vite.config.ts) so ad
    // blockers don't drop events.
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: "2025-05-24",
    person_profiles: "identified_only",
  });
}

export { posthog };

export function track(event: string, properties?: Record<string, unknown>) {
  if (analyticsEnabled) posthog.capture(event, properties);
}
