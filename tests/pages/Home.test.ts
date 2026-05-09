import { afterEach, describe, expect, test, vi } from 'vitest'
import { SITE } from '../../src/consts'
import LayoutStub from '../fixtures/LayoutStub.astro'
import PageHeadStub from '../fixtures/PageHeadStub.astro'
import { render } from '../helpers/astro'

type Post = {
  id: string
  collection: 'posts'
  data: {
    title: string
    description: string
    date: Date
    draft: boolean
    tags: string[]
  }
}

function createPost(index: number): Post {
  return {
    id: `post-${index}`,
    collection: 'posts',
    data: {
      title: `Post ${index}`,
      description: `Description ${index}`,
      date: new Date(`2025-01-0${index}`),
      draft: false,
      tags: ['testing'],
    },
  }
}

async function renderHomePage(posts: Post[]) {
  vi.resetModules()

  const getRecentPosts = vi.fn(async () => posts)

  vi.doMock('@/layouts/Layout.astro', () => ({ default: LayoutStub }))
  vi.doMock('@/components/PageHead.astro', () => ({ default: PageHeadStub }))
  vi.doMock('@/lib/data-utils', () => ({
    getCombinedReadingTime: vi.fn(async () => '1 min read'),
    getRecentPosts,
    getSubpostCount: vi.fn(async () => 0),
    isSubpost: vi.fn(() => false),
    parseAuthors: vi.fn(async () => []),
  }))

  const { default: HomePage } = await import('../../src/pages/index.astro')
  const html = await render(HomePage, {
    request: new Request(SITE.href),
  })

  return { getRecentPosts, html }
}

afterEach(() => {
  vi.doUnmock('@/layouts/Layout.astro')
  vi.doUnmock('@/components/PageHead.astro')
  vi.doUnmock('@/lib/data-utils')
})

describe('Home page', () => {
  test('renders the hero post, email signup, and remaining featured posts in order', async () => {
    const posts = [createPost(1), createPost(2), createPost(3)]
    const { getRecentPosts, html } = await renderHomePage(posts)
    const section = html.querySelector('main section')
    const postLinks = html.querySelectorAll('main section a[href^="/posts/"]')

    expect(getRecentPosts).toHaveBeenCalledWith(SITE.featuredPostCount + 1)
    expect(postLinks).toHaveLength(SITE.featuredPostCount)
    posts.forEach((post, index) => {
      expect(postLinks[index]?.text).toContain(post.data.title)
    })
    expect(postLinks[0]?.getAttribute('class')).not.toContain('sm:flex-row')
    expect(postLinks[1]?.getAttribute('class')).toContain('sm:flex-row')

    const markup = section?.toString() ?? ''
    expect(markup.indexOf('Post 1')).toBeLessThan(
      markup.indexOf('data-email-signup'),
    )
    expect(markup.indexOf('data-email-signup')).toBeLessThan(
      markup.indexOf('Post 2'),
    )
  }, 15000)

  test('links to all posts only when more posts exist beyond the featured set', async () => {
    const featuredPosts = Array.from(
      { length: SITE.featuredPostCount },
      (_, index) => createPost(index + 1),
    )
    const withExtraPost = [...featuredPosts, createPost(4)]

    const withoutExtra = await renderHomePage(featuredPosts)
    expect(withoutExtra.html.querySelector('main a[href="/posts"]')).toBeNull()

    const withExtra = await renderHomePage(withExtraPost)
    const allPostsLink = withExtra.html.querySelector('main a[href="/posts"]')
    const postLinks = withExtra.html.querySelectorAll(
      'main section a[href^="/posts/"]',
    )

    expect(allPostsLink?.text).toContain('See all posts')
    expect(postLinks).toHaveLength(SITE.featuredPostCount)
    expect(postLinks.some((link) => link.text.includes('Post 4'))).toBe(false)
  }, 15000)
})
