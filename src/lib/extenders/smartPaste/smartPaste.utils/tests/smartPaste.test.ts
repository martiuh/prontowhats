import { smartPaste } from '../smartPaste';

describe('smartPaste', () => {
  it('Removes all dashes', () => {
    const { formatted } = smartPaste('1-2-3');

    expect(formatted).toMatch('123');
  });

  it('Removes all whitespace', () => {
    const { formatted } = smartPaste('1 2 3');

    expect(formatted).toMatch('123');
  });

  it('Removes dashes and whitespace combined', () => {
    const { formatted } = smartPaste('1-2 3-4 5 6 7');

    expect(formatted).toMatch('1234567');
  });

  // it('Returns a country code when present', () => {
  //   const { formatted, country_code } = smartPaste('+523315609087');
  //   expect(country_code).toMatch(/\+52$/);
  // });
});
