const API_HOST = 'eu.i.posthog.com'
const ASSET_HOST = 'eu-assets.i.posthog.com'

export async function handlePostHogProxyRequest(
  request: Request,
  ctx: ExecutionContext,
) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    })
  }

  const url = new URL(request.url)
  const pathname = url.pathname
  const search = url.search
  const pathWithParams = pathname + search

  if (isPostHogAssetPath(pathname)) {
    return retrieveAsset(request, pathWithParams, ctx)
  } else {
    return forwardRequest(request, pathWithParams)
  }
}

function isPostHogAssetPath(pathname: string) {
  return pathname.startsWith('/static/') || pathname.startsWith('/array/')
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
  return withCorsHeaders(response, request)
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

  const response = await fetch(originRequest)
  return withCorsHeaders(response, request)
}

function withCorsHeaders(response: Response, request: Request) {
  const headers = new Headers(response.headers)

  for (const [key, value] of corsHeaders(request)) {
    headers.set(key, value)
  }
  headers.set('Vary', appendVary(headers.get('Vary'), 'Origin'))

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('Origin') ?? '*'
  const requestedHeaders = request.headers.get('Access-Control-Request-Headers')

  return new Headers({
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': requestedHeaders ?? '*',
  })
}

function appendVary(current: string | null, value: string) {
  if (!current) return value

  const values = current.split(',').map((item) => item.trim().toLowerCase())
  return values.includes(value.toLowerCase()) ? current : `${current}, ${value}`
}
