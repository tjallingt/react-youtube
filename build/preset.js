/**
 * Generate a Babel preset that outputs ES modules when the env is `es`, and
 * CommonJS modules otherwise.
 */

const es = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'es';

module.exports = {
  presets: [
    ['es2015', {
      modules: es ? false : 'commonjs',
    }],
    'react',
    'stage-0',
  ],
};
