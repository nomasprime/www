import { defineMiddleware } from 'astro:middleware';
import { FEATURE_TOGGLE } from '@/consts';

export const onRequest = defineMiddleware((context, next) => {
  const { url } = context;

  if (url.pathname.startsWith('/authors')) {
    if (!FEATURE_TOGGLE.authors) {
      return context.rewrite('/404');
    }
  }

  return next();
});