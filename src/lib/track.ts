import type { GTag } from "@types/gtag.js";

declare const gtag: GTag;
declare var SEND_MESSAGE: boolean;

type GActions = string;
type GCategories = "engagement";

interface ActionOptions {
  category?: GCategories;
  label?: string;
  value?: string;
  [x: string]: any;
}

const hasGtag = typeof gtag === "function";

/**
 * Track Google Tag Events
 */
export function track(action: GActions, options: ActionOptions) {
  const { category = "engagement", label, value, ...moreOptions } = options;

  const trackOptions = {
    ...(typeof label !== "undefined" ? { event_label: label } : {}),
    ...(typeof value !== "undefined" ? { value } : {}),
    ...(typeof moreOptions !== "undefined" ? moreOptions : {}),
  };

  const sendEvent = () =>
    gtag("event", action, {
      event_category: category,
      ...trackOptions,
    });

  if (hasGtag && SEND_MESSAGE) {
    sendEvent();
    return;
  }

  console.log("[track]", action, trackOptions);
}
