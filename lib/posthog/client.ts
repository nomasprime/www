import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function getClient() {
    if (client) return client

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    if (!key) throw new Error('Missing POSTHOG_KEY')

    client = new PostHog(key, {
        host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
        flushAt: 1,
        flushInterval: 0,
    })

    return client
}