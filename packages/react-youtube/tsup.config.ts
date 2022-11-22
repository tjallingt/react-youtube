import { defineConfig } from 'tsup';

export default defineConfig({
  sourcemap: true,
  clean: true,
  outExtension({ format }) {
    return {
      js: format !== 'cjs' ? `.${format}.js` : '.js',
    };
  },
});
