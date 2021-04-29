export interface SmartPaste {
  formatted: string;
  country_code: string | null;
}

export function smartPaste(text: string): SmartPaste {
  if (/-*/.test(text)) {
    text = replaceAll(text, '-', '');
  }

  if (/\s/.test(text)) {
    text = replaceAll(text, ' ', '');
  }

  // Let's cover these two examples
  // source: https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s03.html
  const hasValidCountryCode = /^\+(?:[0-9]?){6,14}[0-9]$/.test(text);
  let code = null;

  if (hasValidCountryCode) {
    // Assumptions
    // 1. At most the first three characters are the code
    // 2. Let's calculate the size of the string without 3 numbers
    // 3. If the string without the three numbers is invalid, then the code is two numbers long
    // 4. Else the number is three numbers long
    const codeMatch = text.match(/^\+([0-9]?){1,3}/);
    if (codeMatch?.length) {
      code = codeMatch[0];
    }
  }

  return {
    formatted: text,
    country_code: code,
  };
}

function replaceAll(str: string, find: string | RegExp, replace: string) {
  return str.replace(new RegExp(find, 'g'), replace);
}
