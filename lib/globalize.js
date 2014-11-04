/**
 * Module dependencies
 */

var randomstring = require('randomstring');

/**
 * Expose `globalize
 */

module.exports = globalize;

/**
 * Expose some variable onto the global namespace under
 * a randomly generated string, then return that reference.
 *
 * @param {*} variable to be exposed
 * @returns {*}
 */

function globalize(variable) {
  var randString = randomstring.generate();
  window[randString] = variable;
  return randString;
}
