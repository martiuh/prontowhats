const fs = require('fs');
const { countries } = require('../src/json/country-codes.json');

/**
 * @typedef {Object} CountryCode
 * @property {string} name_en
 * @property {string} name_es
 * @property {string} dial_code
 * @property {string} code
 */

/**
 *
 * @param {CountryCode} country
 * @returns string
 */
function createOption(country) {
  const { code, dial_code } = country;
  const name = country.name_es;

  return `option(value="${code}" data-code="${dial_code}" data-name="${name}") ${name} (${dial_code}) 
  <span aria-hidden="true"> ${createEmoji(code)} </span>
   `;
}

const MAGIC_NUMBER = 127462 - 65;

function createEmoji(code) {
  return String.fromCodePoint(
    ...[...code].map((c) => MAGIC_NUMBER + c.charCodeAt(0))
  );
}

const countriesOptions = [
  'option(value="" disabled="true" selected="true") Selecciona código de país',
  ...countries.map(createOption),
].join('\n');

fs.writeFileSync(
  `${__dirname}/../src/pug/includes/countries.pug`,
  countriesOptions
);
