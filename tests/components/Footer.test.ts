import { describe, expect, test } from 'vitest'
import Footer from '../../src/components/Footer.astro'
import { render } from '../helpers/astro'
import { SOCIAL_LINKS } from '../../src/consts'

describe('Footer component', () => {
  test('renders social icons', async () => {
    const html = await render(Footer)
    const links = html.querySelectorAll('ul[role="list"] li a')

    expect(links.length).toBe(SOCIAL_LINKS.length)

    SOCIAL_LINKS.forEach((social) => {
      const link = html.querySelector(`a[aria-label="${social.label}"]`)
      expect(link).not.toBeNull()
      expect(link?.getAttribute('href')).toBe(social.href)
    })
  })

  test('renders copyright notice', async () => {
    const html = await render(Footer)
    const currentYear = new Date().getFullYear().toString()
    const footerText = html.textContent

    expect(footerText).toContain(`© ${currentYear} All rights reserved`)
  })
})
