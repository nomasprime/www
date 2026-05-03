export interface KitSubscribeEnv {
  KIT_API_KEY?: string
  KIT_FORM_ID?: string
}

export interface SubscribeInput {
  email: string
  referrer?: string
  website?: string
}

const KIT_API_BASE_URL = 'https://api.kit.com/v4'

export class SubscribeError extends Error {
  constructor(message = 'Unable to subscribe right now.') {
    super(message)
    this.name = 'SubscribeError'
  }
}

async function postToKit(
  path: string,
  apiKey: string,
  body: Record<string, unknown>,
) {
  return fetch(`${KIT_API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
    },
    body: JSON.stringify(body),
  })
}

export async function subscribeWithKit(
  input: SubscribeInput,
  env: KitSubscribeEnv,
) {
  if (input.website) {
    return { subscribed: true }
  }

  if (!env.KIT_API_KEY || !env.KIT_FORM_ID) {
    throw new SubscribeError()
  }

  const email = input.email.trim().toLowerCase()
  const subscriberResponse = await postToKit('/subscribers', env.KIT_API_KEY, {
    email_address: email,
  })

  if (!subscriberResponse.ok) {
    throw new SubscribeError()
  }

  const formResponse = await postToKit(
    `/forms/${encodeURIComponent(env.KIT_FORM_ID)}/subscribers`,
    env.KIT_API_KEY,
    {
      email_address: email,
      ...(input.referrer ? { referrer: input.referrer } : {}),
    },
  )

  if (!formResponse.ok) {
    throw new SubscribeError()
  }

  return { subscribed: true }
}
