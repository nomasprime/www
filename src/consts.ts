import type { IconMap, SocialLink, Site } from '@/types'

export const FEATURE_TOGGLE: Record<string, boolean> = {
  about: false,
  authors: false,
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

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
]

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
