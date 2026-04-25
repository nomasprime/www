import { describe, expect, test } from 'vitest'
import Header from '../../src/components/Header.astro'
import { render } from '../helpers/astro'

describe('Header component', () => {
  test('links to home page', async () => {
    const html = await render(Header)
    const link = html.querySelector('a[aria-label="Home"]')

    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe('/')
  })
})
