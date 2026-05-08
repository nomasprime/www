import astroWorker from '@astrojs/cloudflare/entrypoints/server'
import { handlePostHogProxyRequest } from './posthog-proxy'

const POSTHOG_PROXY_HOST = 'e.nomasprime.com'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)

    if (url.hostname === POSTHOG_PROXY_HOST) {
      return handlePostHogProxyRequest(request, ctx)
    }

    return astroWorker.fetch(request, env, ctx)
  },
} satisfies ExportedHandler<Env>
