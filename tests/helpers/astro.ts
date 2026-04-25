import reactRenderer from '@astrojs/react/server.js'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import type { ContainerRenderOptions } from 'astro/container'
import { parse } from 'node-html-parser'

export async function render(Component: any, options: ContainerRenderOptions = {}) {
  const container = await AstroContainer.create()

  container.addServerRenderer({
    renderer: reactRenderer,
    name: '@astrojs/react',
  })

  const html = await container.renderToString(Component, options)

  return parse(html)
}
