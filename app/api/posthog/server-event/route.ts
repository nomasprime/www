import { NextResponse } from 'next/server'
import { getClient } from '@/lib/posthog/client'

export async function POST() {
    try {
        const posthog = getClient()

        posthog.capture({
            distinctId: 'server-anonymous',
            event: 'example_server_button_clicked',
            properties: {
                source: 'app/api/posthog/server-event/route',
            },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('PostHog server event failed:', error)
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}