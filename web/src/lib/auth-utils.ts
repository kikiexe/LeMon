import { createServerFn } from '@tanstack/react-start'

export const checkProfileServerFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { checkProfileExistence: serverAction } = await import('./db-actions.server')
    return await serverAction()
  })

export const getPublicProfileServerFn = createServerFn({ method: 'GET' })
  .handler(async (ctx: any) => {
    const username = ctx.data
    if (!username) return null
    
    const { db } = await import('#/db/index')
    
    try {
      const userProfile = await db.query.profile.findFirst({
        where: (p: any, { eq }: any) => eq(p.slug, username)
      })

      if (!userProfile) return null

      return {
        id: userProfile.id,
        displayName: userProfile.displayName,
        username: userProfile.slug,
        avatarUrl: userProfile.avatarUrl,
        walletAddress: userProfile.walletAddress,
        bio: userProfile.bio
      }
    } catch (e) {
      return null
    }
  })
