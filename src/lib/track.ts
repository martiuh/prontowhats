import type { GTag } from "@types/gtag.js";

declare const gtag: GTag;
declare var SEND_MESSAGE: boolean; // Note: SEND_MESSAGE is not a standard GA parameter.

type GActions = string;
type GCategories = "engagement" | "conversion" | "ui"; // Add more categories as needed

interface ActionOptions {
  category?: GCategories;
  label?: string;
  value?: number; // Change to number, as GA value parameter should be numeric
  [x: string]: any; // Allow for custom parameters
}

const hasGtag = typeof gtag === "function";

/**
 * Track Google Analytics Events using gtag.js
 *
 * @param {GActions} action - The name of the event (e.g., 'select_content').
 * @param {ActionOptions} options - The event parameters (category, label, value, and custom).
 */
export function track(action: GActions, options: ActionOptions) {
  // Use a more descriptive default category if 'engagement' is not always appropriate.
  const { category = "engagement", label, value, ...moreOptions } = options;

  // Build the event parameters object.
  // This is a more robust way to handle undefined values.
  const eventParams: Record<string, any> = {
    event_category: category,
  };

  // Add optional parameters if they exist.
  if (label) {
    eventParams.event_label = label;
  }
  if (value !== undefined) {
    // Ensure value is a number for GA's 'value' parameter
    eventParams.value = Number(value);
  }

  // Merge the remaining custom parameters.
  Object.assign(eventParams, moreOptions);

  // The condition to send the event.
  // It's crucial to check if gtag is available and if the global variable is set.
  if (hasGtag && SEND_MESSAGE) {
    gtag("event", action, eventParams);
    console.log(`[gtag] Event sent: "${action}"`, eventParams);
  } else {
    // Always log the event to the console for debugging purposes.
    // This is especially helpful if gtag is not found or SEND_MESSAGE is false.
    console.log(`[track] Debugging event: "${action}"`, eventParams);
  }
}
