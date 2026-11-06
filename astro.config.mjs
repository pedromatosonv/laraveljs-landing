import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pedromatosonv.github.io',
  base: '/laraveljs-landing',
  compressHTML: false,
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'light',
    },
  },
});
