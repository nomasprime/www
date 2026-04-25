/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    dir: 'tests',
    exclude: [
      'tests/e2e/**'
    ]
  },
});