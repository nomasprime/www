import astroWorker from '@astrojs/cloudflare/entrypoints/server'
import { handlePostHogProxyRequest } from './posthog-proxy'

const POSTHOG_PROXY_HOST = 'e.nomasprime.com'
const POSTHOG_PREVIEW_PROXY_PREFIX = '/ph'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.hostname === POSTHOG_PROXY_HOST) {
      return handlePostHogProxyRequest(request, ctx)
    }

    if (
      url.hostname.endsWith('.workers.dev') &&
      url.pathname.startsWith(`${POSTHOG_PREVIEW_PROXY_PREFIX}/`)
    ) {
      url.pathname =
        url.pathname.slice(POSTHOG_PREVIEW_PROXY_PREFIX.length) || '/'

      return handlePostHogProxyRequest(new Request(url, request), ctx)
    }

    return astroWorker.fetch(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
