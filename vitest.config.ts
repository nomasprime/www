/// <reference types="vitest/config" />
import { configDefaults } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    exclude: [...configDefaults.exclude, 'tests/e2e/**'],
  },
});