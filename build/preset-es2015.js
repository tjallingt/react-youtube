/**
 * Configure the es2015 preset to use ES modules or CommonJS depending on an
 * env variable.
 */

const esOptions = process.env.BABEL_ENV === 'es' ? { modules: false } : {};

module.exports = {
  presets: [
    ['es2015', esOptions],
  ],
};
