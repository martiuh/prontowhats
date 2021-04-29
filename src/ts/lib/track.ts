import { GTag } from '@types/gtag.js';
import { isDevEnv } from '@utils/isDevEnv';

declare const gtag: GTag;
declare var SEND_MESSAGE: boolean;

type GActions = string;
type GCategories = 'engagement';

interface ActionOptions {
  category?: GCategories;
  label?: string;
  value?: string;
  [x: string]: any;
}

/**
 * Track Google Tag Events
 */
export function track(action: GActions, options: ActionOptions) {
  const { category = 'engagement', label, value, ...moreOptions } = options;

  const trackOptions = {
    ...(typeof label !== 'undefined' ? { event_label: label } : {}),
    ...(typeof value !== 'undefined' ? { value } : {}),
    ...(typeof moreOptions !== 'undefined' ? moreOptions : {}),
  };

  const sendEvent = () =>
    gtag('event', action, {
      event_category: category,
      ...trackOptions,
    });

  const hasGtag = typeof gtag === 'function';

  if (hasGtag || SEND_MESSAGE) {
    sendEvent();
    return;
  }

  console.log('[track]', action, trackOptions);
}
