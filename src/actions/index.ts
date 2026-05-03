import { ActionError, defineAction } from 'astro:actions'
import { z } from 'astro/zod'

import {
  subscribeWithKit,
  SubscribeError,
  type KitSubscribeEnv,
} from '@/lib/kit-subscribe'

export const server = {
  subscribe: defineAction({
    accept: 'form',
    input: z.object({
      email: z.email('Please enter a valid email address.'),
      website: z.string().optional(),
      referrer: z.string().optional(),
    }),
    handler: async (input) => {
      try {
        const { env } = await import('cloudflare:workers')

        return await subscribeWithKit(input, env as KitSubscribeEnv)
      } catch (error) {
        if (error instanceof SubscribeError) {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message,
          })
        }

        throw error
      }
    },
  }),
}
