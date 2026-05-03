import { afterEach, describe, expect, test, vi } from 'vitest'
import { isInputError } from 'astro:actions'
import { server } from '../../src/actions'
import { SubscribeError, subscribeWithKit } from '../../src/lib/kit-subscribe'

const env = {
  KIT_API_KEY: 'test-api-key',
  KIT_FORM_ID: '12345',
}

describe('subscribeWithKit', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('subscribes a valid email through Kit', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 201 }))

    await expect(
      subscribeWithKit(
        {
          email: 'Reader@Example.com',
          referrer: 'https://example.com/',
        },
        env,
      ),
    ).resolves.toEqual({ subscribed: true })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://api.kit.com/v4/subscribers',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email_address: 'reader@example.com',
        }),
      }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://api.kit.com/v4/forms/12345/subscribers',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email_address: 'reader@example.com',
          referrer: 'https://example.com/',
        }),
      }),
    )
  })

  test('returns success and skips Kit when the honeypot is filled', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(
      subscribeWithKit(
        {
          email: 'bot@example.com',
          website: 'https://spam.example',
        },
        env,
      ),
    ).resolves.toEqual({ subscribed: true })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('throws a safe error when Kit env vars are missing', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(
      subscribeWithKit({ email: 'reader@example.com' }, {}),
    ).rejects.toBeInstanceOf(SubscribeError)

    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('rejects an invalid email before calling Kit', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const formData = new FormData()
    formData.set('email', 'not-an-email')
    const actionContext = {}
    Reflect.set(actionContext, Symbol.for('astro.actionAPIContext'), true)

    const result = await server.subscribe.call(actionContext, formData)

    expect(result.data).toBeUndefined()
    expect(result.error?.status).toBe(400)
    expect(result.error).toSatisfy(isInputError)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('throws a generic failure when Kit rejects the subscriber request', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{}', { status: 422 }),
    )

    await expect(
      subscribeWithKit({ email: 'reader@example.com' }, env),
    ).rejects.toBeInstanceOf(SubscribeError)
  })

  test('throws a generic failure when Kit rejects the form request', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('{}', { status: 201 }))
      .mockResolvedValueOnce(new Response('{}', { status: 422 }))

    await expect(
      subscribeWithKit({ email: 'reader@example.com' }, env),
    ).rejects.toBeInstanceOf(SubscribeError)
  })
})
