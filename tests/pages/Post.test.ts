import { afterEach, describe, expect, test, vi } from 'vitest'
import { SITE } from '../../src/consts'
import LayoutStub from '../fixtures/LayoutStub.astro'
import PageHeadStub from '../fixtures/PageHeadStub.astro'
import PostContentStub from '../fixtures/PostContentStub.astro'
import { render } from '../helpers/astro'

type Post = {
  id: string
  collection: 'posts'
  data: {
    title: string
    description: string
    date: Date
    draft: boolean
    authors: string[]
  }
}

const post: Post = {
  id: 'integrating-an-ai-software-engineering-agent',
  collection: 'posts',
  data: {
    title: 'Integrating An AI Software Engineering Agent',
    description: 'Post description',
    date: new Date('2026-05-12'),
    draft: false,
    authors: [],
  },
}

async function renderPostPage() {
  vi.resetModules()

  vi.doMock('@/layouts/Layout.astro', () => ({ default: LayoutStub }))
  vi.doMock('@/components/PostHead.astro', () => ({ default: PageHeadStub }))
  vi.doMock('astro:content', () => ({
    render: vi.fn(async () => ({
      Content: PostContentStub,
      headings: [],
    })),
  }))
  vi.doMock('@/lib/data-utils', () => ({
    getAdjacentPosts: vi.fn(async () => ({
      newer: null,
      older: null,
      parent: null,
    })),
    getAllPostsAndSubposts: vi.fn(async () => [post]),
    getCombinedReadingTime: vi.fn(async () => null),
    getParentId: vi.fn((postId: string) => postId.split('/')[0]),
    getParentPost: vi.fn(async () => null),
    getPostReadingTime: vi.fn(async () => '1 min read'),
    getSubpostCount: vi.fn(async () => 0),
    getTOCSections: vi.fn(async () => []),
    hasSubposts: vi.fn(async () => false),
    isSubpost: vi.fn(() => false),
    parseAuthors: vi.fn(async () => []),
  }))

  const { default: PostPage } =
    await import('../../src/pages/posts/[...id].astro')

  return await render(PostPage, {
    props: post,
    params: { id: post.id },
    request: new Request(`${SITE.href}/posts/${post.id}`),
  })
}

afterEach(() => {
  vi.doUnmock('@/layouts/Layout.astro')
  vi.doUnmock('@/components/PostHead.astro')
  vi.doUnmock('astro:content')
  vi.doUnmock('@/lib/data-utils')
})

describe('Post page', () => {
  test('renders the post email signup after the article content', async () => {
    const html = await renderPostPage()
    const article = html.querySelector('article')
    const signup = article?.querySelector('[data-email-signup]')

    expect(signup).not.toBeNull()
    expect(signup?.textContent).toContain("Don't miss out on the next post")
    expect(signup?.textContent).toContain(
      'High signal posts straight to your inbox — no noise',
    )
    expect(article?.toString().indexOf('data-post-content')).toBeLessThan(
      article?.toString().indexOf('data-email-signup') ?? -1,
    )
  }, 15000)
})
