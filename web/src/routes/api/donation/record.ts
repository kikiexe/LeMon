import { createFileRoute } from '@tanstack/react-router'
import { db } from '#/db/index'
import { donation } from '#/db/schema'
import { censorMessageServerFn } from '../../../lib/ai-utils'
import { env } from '#/env'
import { verifyMonadTransaction } from '#/lib/monad-utils'

export const Route = createFileRoute('/api/donation/record')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { slug, senderAddress, senderName, amount, txHash, message } =
            await request.json()

          const targetProfile = await db.query.profile.findFirst({
            where: (p, { eq }) => eq(p.slug, slug),
          })

          if (!targetProfile) {
            return new Response(
              JSON.stringify({ error: 'Profile not found' }),
              { status: 404 },
            )
          }

          console.log(`[Donation API] Verifying transaction: ${txHash}`)
          const verification = await verifyMonadTransaction(txHash)

          if (verification.status !== 'confirmed') {
            return new Response(
              JSON.stringify({
                error: `Transaction verification failed: status is ${verification.status}`,
                verification,
              }),
              { status: 400 },
            )
          }

          let filteredMessage = message
          if (message) {
            try {
              const result = await (censorMessageServerFn as any)({
                data: { message },
              })
              filteredMessage = result.censored
            } catch (err) {
              console.error('[AI Shield] Failed:', err)
            }
          }

          const donationData = {
            profileId: targetProfile.id,
            senderAddress: senderAddress,
            senderName: senderName || 'Anonymous',
            amount: amount,
            txHash: txHash,
            message: filteredMessage,
            currency: 'MON',
            status: verification.status,
            blockNumber: verification.blockNumber,
          }

          const [newDonation] = await db
            .insert(donation)
            .values(donationData)
            .returning()

          try {
            const { default: Ably } = await import('ably')
            const ably = new Ably.Rest(env.ABLY_API_KEY)
            const channel = ably.channels.get(
              `donations:${targetProfile.walletAddress}`,
            )
            await channel.publish('new-donation', newDonation)
            console.log(
              `[Ably] Published donation to channel: donations:${targetProfile.walletAddress}`,
            )
          } catch (ablyErr) {
            console.error('[Ably] Publish failed:', ablyErr)
          }

          return new Response(
            JSON.stringify({ ok: true, donation: newDonation }),
            {
              headers: { 'Content-Type': 'application/json' },
            },
          )
        } catch (e: any) {
          console.error('[Donation API] Error:', e)
          return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
          })
        }
      },
    },
  },
})
