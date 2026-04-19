import type { IconMap, SocialLink, Site } from '@/types'

export const FEATURE_TOGGLE: Record<string, boolean> = {
  about: false,
  authors: false,
  posts: false
}

export const SITE: Site = {
  title: 'Nomas Prime',
  description:
    'astro-erudite is a opinionated, unstyled blogging template—built with Astro, Tailwind, and shadcn/ui.',
  href: 'https://astro-erudite.vercel.app',
  author: 'nomasprime',
  locale: 'en-US',
  featuredPostCount: 3,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = []

if (FEATURE_TOGGLE.posts) {
  NAV_LINKS.push({
    href: '/posts',
    label: 'posts',
  })
}

if (FEATURE_TOGGLE.about) {
  NAV_LINKS.push({
    href: '/about',
    label: 'about',
  })
}

if (FEATURE_TOGGLE.authors) {
  NAV_LINKS.push({
    href: '/authors',
    label: 'authors',
  })
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://www.youtube.com/@nomasprime',
    label: 'YouTube',
  },
  {
    href: 'https://www.instagram.com/nomasprime/',
    label: 'Instagram',
  },
  {
    href: 'https://www.tiktok.com/@nomasprime',
    label: 'TikTok',
  },
  {
    href: 'https://mastodon.social/@nomasprime',
    label: 'Mastodon',
  },
  {
    href: 'https://www.linkedin.com/in/nomasprime/',
    label: 'LinkedIn',
  },
  {
    href: 'https://bsky.app/profile/nomasprime.bsky.social',
    label: 'BlueSky',
  },
  {
    href: 'https://www.x.com/nomasprime',
    label: 'X',
  },
  {
    href: 'https://github.com/nomasprime',
    label: 'GitHub',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  GitHub: 'ri:github-line',
  LinkedIn: 'ri:linkedin-line',
  BlueSky: 'ri:bluesky-line',
  Mastodon: 'ri:mastodon-line',
  YouTube: 'ri:youtube-line',
  Instagram: 'ri:instagram-line',
  TikTok: 'ri:tiktok-line',
  X: 'ri:twitter-x-line',
  RSS: 'ri:rss-line',
}
