export interface SmartPaste {
  formatted: string;
  dial_code_subsets: string[];
}

function getDialCodeSubsets(digits: string): string[] {
  const subsets: string[] = [];

  // Generate subsets up to 5 digits (longest dial codes) or the length of input
  const maxLength = Math.min(digits.length, 4);

  for (let i = 1; i <= maxLength; i++) {
    subsets.push("+" + digits.substring(0, i));
  }

  return subsets;
}

function replaceAll(str: string, find: string | RegExp, replace: string) {
  return str.replace(new RegExp(find, "g"), replace);
}

export function smartPaste(text: string): SmartPaste {
  if (/-*/.test(text)) {
    text = replaceAll(text, "-", "");
  }

  if (/\s/.test(text)) {
    text = replaceAll(text, " ", "");
  }

  const result: SmartPaste = {
    formatted: text,
    dial_code_subsets: [],
  };

  // Generate dial code subsets if input starts with '+' followed by digits
  const dialCodeMatch = text.match(/^\+(\d{1,})$/);
  if (Array.isArray(dialCodeMatch) && typeof dialCodeMatch[1] === "string") {
    result.dial_code_subsets = getDialCodeSubsets(dialCodeMatch[1]);
  }

  return result;
}
