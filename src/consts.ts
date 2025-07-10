import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'astro-erudite',
  description:
    'astro-erudite is a opinionated, unstyled blogging template—built with Astro, Tailwind, and shadcn/ui.',
  href: 'https://astro-erudite.vercel.app',
  author: 'jktrn',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/authors',
    label: 'authors',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://www.youtube.com/@nomasprime',
    label: 'YouTube',
  },
  {
    href: 'https://bsky.app/profile/nomasprime.bsky.social',
    label: 'BlueSky',
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
    href: 'https://github.com/nomasprime',
    label: 'GitHub',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'ri:github-line',
  LinkedIn: 'ri:linkedin-line',
  BlueSky: 'ri:bluesky-line',
  Mastodon: 'ri:mastodon-line',
  YouTube: 'ri:youtube-line',
  RSS: 'ri:rss-line',
}
