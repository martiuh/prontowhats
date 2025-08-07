const fs = require("fs");
const { countries } = require("../src/json/country-codes.json");

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

  return;
}

function start() {
  /**
   * @typedef {Record<string, boolean>}
   */
  let byCode = {};

  countries.forEach((country) => {
    byCode[country.dial_code] = true;
  });

  fs.writeFileSync(
    `${__dirname}/../src/json/codes.json`,
    JSON.stringify(byCode)
  );
}

start();
