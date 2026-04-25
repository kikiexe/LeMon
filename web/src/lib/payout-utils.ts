import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const getPayoutSettingsServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { getPayoutSettings } = await import('./db-actions.server')
  const res = await getPayoutSettings()
  return res as any
})

export const updatePayoutSettingsServerFn = createServerFn({
  method: 'POST',
})
  .inputValidator(
    z.object({
      payoutAddress: z.string(),
      isStakingEnabled: z.boolean(),
    }),
  )
  .handler(async ({ data: { payoutAddress, isStakingEnabled } }: { data: { payoutAddress: string; isStakingEnabled: boolean } }) => {
    const { updatePayoutSettings } = await import('./db-actions.server')
    return await updatePayoutSettings(payoutAddress, isStakingEnabled)
  })
