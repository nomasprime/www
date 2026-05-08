const API_HOST = 'eu.i.posthog.com'
const ASSET_HOST = 'eu-assets.i.posthog.com'

export async function handlePostHogProxyRequest(
  request: Request,
  ctx: ExecutionContext,
) {
  const url = new URL(request.url)
  const pathname = url.pathname
  const search = url.search
  const pathWithParams = pathname + search

  if (pathname.startsWith('/static/') || pathname.startsWith('/array/')) {
    return retrieveAsset(request, pathWithParams, ctx)
  } else {
    return forwardRequest(request, pathWithParams)
  }
}

async function retrieveAsset(
  request: Request,
  pathname: string,
  ctx: ExecutionContext,
) {
  const defaultCache = (caches as CacheStorage & { default: Cache }).default
  let response = await defaultCache.match(request)
  if (!response) {
    response = await fetch(`https://${ASSET_HOST}${pathname}`)
    ctx.waitUntil(defaultCache.put(request, response.clone()))
  }
  return response
}

async function forwardRequest(request: Request, pathWithSearch: string) {
  const ip = request.headers.get('CF-Connecting-IP') || ''
  const originHeaders = new Headers(request.headers)
  originHeaders.delete('cookie')
  originHeaders.set('X-Forwarded-For', ip)

  const originRequest = new Request(`https://${API_HOST}${pathWithSearch}`, {
    method: request.method,
    headers: originHeaders,
    body:
      request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.arrayBuffer()
        : null,
    redirect: request.redirect,
  })

  return await fetch(originRequest)
}
