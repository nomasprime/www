import { describe, expect, test } from 'vitest'
import EmailSignup from '../../src/components/EmailSignup.astro'
import { render } from '../helpers/astro'

describe('EmailSignup component', () => {
  test('renders the signup form controls', async () => {
    const html = await render(EmailSignup)
    const signup = html.querySelector('[data-email-signup]')
    const form = html.querySelector('form[data-email-signup-form]')
    const email = html.querySelector('input[name="email"]')
    const submit = html.querySelector('button[data-email-signup-submit]')
    const label = html.querySelector('label[for="email-signup-email"]')
    const honeypot = html.querySelector('input[name="website"]')
    const referrer = html.querySelector('input[name="referrer"]')
    const status = html.querySelector('[data-email-signup-status]')

    expect(signup).not.toBeNull()
    expect(form).not.toBeNull()
    expect(email?.getAttribute('type')).toBe('email')
    expect(email?.getAttribute('required')).not.toBeNull()
    expect(submit?.textContent).toContain('Subscribe')
    expect(label?.textContent).toContain('Email address')
    expect(honeypot?.getAttribute('tabindex')).toBe('-1')
    expect(honeypot?.getAttribute('autocomplete')).toBe('off')
    expect(referrer?.getAttribute('type')).toBe('hidden')
    expect(status?.getAttribute('role')).toBe('status')
  })
})
