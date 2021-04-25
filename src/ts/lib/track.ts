import { GTag } from '@types/gtag.js';

declare const gtag: GTag;

type GActions = string;
type GCategories = 'engagement';

interface ActionOptions {
  category?: GCategories;
  label: string;
  value?: string;
}

/**
 * Track Google Tag Events
 */
export function track(action: GActions, options: ActionOptions) {
  const { category = 'engagement', label, value } = options;
  if (typeof gtag === 'function') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  } else {
    console.log('[track]', action, { category, label, value });
  }
}
