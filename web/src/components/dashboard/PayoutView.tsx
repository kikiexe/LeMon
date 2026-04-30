import { useForm } from '@tanstack/react-form'
import { updatePayoutSettingsServerFn } from '../../lib/payout-utils'
import { Wallet, ShieldCheck, Loader2, Zap, Lock, Check, ArrowRight, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { TipFyVaultABI, TIPFY_VAULT_ADDRESS } from '../../lib/TipFyVaultABI'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'

export const PayoutView = ({
  initialAddress,
  initialStaking,
}: {
  initialAddress: string
  initialStaking?: boolean
}) => {
  const [success, setSuccess] = useState(false)
  const { data: hash, writeContract, isPending: isTxPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const form = useForm({
    defaultValues: {
      payoutAddress: initialAddress || '',
      isStakingEnabled: initialStaking || false,
    },
    onSubmit: async ({ value }) => {
      try {
        if (value.isStakingEnabled !== initialStaking) {
          writeContract({
            address: TIPFY_VAULT_ADDRESS,
            abi: TipFyVaultABI,
            functionName: 'toggleStaking',
            args: [value.isStakingEnabled],
          })
        }
        await (updatePayoutSettingsServerFn as any)({ data: value })
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        console.error('Update failed:', err)
      }
    },
  })

  const isLoading = form.state.isSubmitting || isTxPending || isConfirming

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl space-y-8"
    >
      {/* Header */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-secondary)' }}>
          Settings
        </p>
        <h2 className="font-display text-5xl" style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
          PAYOUT<br />
          <span style={{ color: 'var(--cyan)' }}>CONFIG</span>
        </h2>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Pilih bagaimana kamu ingin menerima donasi — langsung ke wallet atau via Vault dengan yield.
        </p>
      </div>

      <form
        onSubmit={e => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="space-y-6"
      >
        {/* ── Mode Selection ── */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-3)' }}>
            <ShieldCheck size={14} style={{ color: 'var(--cyan)' }} />
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Donation Mode
            </span>
          </div>

          <div className="p-5">
            <form.Field
              name="isStakingEnabled"
              children={(field: any) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Direct P2P */}
                  <button
                    type="button"
                    onClick={() => field.handleChange(false)}
                    className="p-5 rounded-xl text-left transition-all"
                    style={{
                      background: !field.state.value ? 'rgba(0,245,255,0.05)' : 'var(--surface-3)',
                      border: `1px solid ${!field.state.value ? 'rgba(0,245,255,0.2)' : 'var(--border)'}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div
                        className="w-9 h-9 flex items-center justify-center rounded-lg"
                        style={{
                          background: !field.state.value ? 'rgba(0,245,255,0.1)' : 'var(--surface-4)',
                          border: `1px solid ${!field.state.value ? 'rgba(0,245,255,0.2)' : 'var(--border)'}`,
                        }}
                      >
                        <Zap size={16} style={{ color: !field.state.value ? 'var(--cyan)' : 'var(--text-muted)' }} />
                      </div>
                      {!field.state.value && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--cyan)' }}>
                          <Check size={11} color="#000" />
                        </div>
                      )}
                    </div>

                    <div className="font-display text-lg mb-1" style={{
                      color: !field.state.value ? 'var(--cyan)' : 'var(--text-primary)',
                      letterSpacing: '0.03em',
                    }}>
                      DIRECT P2P
                    </div>
                    <div className="text-xs font-semibold mb-2" style={{
                      color: !field.state.value ? 'var(--cyan)' : 'var(--text-secondary)',
                    }}>
                      Immediate Settlement
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      Donasi langsung masuk ke wallet. Tidak ada delay, tidak ada yield.
                    </p>
                  </button>

                  {/* Vault Staking */}
                  <button
                    type="button"
                    onClick={() => field.handleChange(true)}
                    className="p-5 rounded-xl text-left transition-all"
                    style={{
                      background: field.state.value ? 'rgba(255,45,120,0.05)' : 'var(--surface-3)',
                      border: `1px solid ${field.state.value ? 'rgba(255,45,120,0.2)' : 'var(--border)'}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div
                        className="w-9 h-9 flex items-center justify-center rounded-lg"
                        style={{
                          background: field.state.value ? 'rgba(255,45,120,0.1)' : 'var(--surface-4)',
                          border: `1px solid ${field.state.value ? 'rgba(255,45,120,0.2)' : 'var(--border)'}`,
                        }}
                      >
                        <Lock size={16} style={{ color: field.state.value ? 'var(--pink)' : 'var(--text-muted)' }} />
                      </div>
                      {field.state.value && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--pink)' }}>
                          <Check size={11} color="#fff" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-display text-lg" style={{
                        color: field.state.value ? 'var(--pink)' : 'var(--text-primary)',
                        letterSpacing: '0.03em',
                      }}>
                        VAULT STAKING
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold mb-2"
                      style={{ color: field.state.value ? '#00ff80' : 'var(--text-secondary)' }}>
                      <TrendingUp size={11} />
                      3.5% APR Yield
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      Dana disimpan di TipFy Vault (Aave V3). Kamu earn yield selama streaming.
                    </p>
                  </button>
                </div>
              )}
            />
          </div>
        </div>

        {/* ── Wallet Address ── */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-3)' }}>
            <Wallet size={14} style={{ color: 'var(--cyan)' }} />
            <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
              Receiver Wallet
            </span>
          </div>

          <div className="p-5 space-y-4">
            <form.Field
              name="payoutAddress"
              children={(field: any) => (
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Wallet Address
                  </label>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    className="input"
                    placeholder="0x..."
                    style={{
                      borderColor: field.state.meta.errors?.length
                        ? 'rgba(255,45,120,0.4)'
                        : 'var(--border-strong)',
                    }}
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <p className="font-mono text-xs" style={{ color: 'var(--pink)' }}>
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                  <p className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Donasi akan dikirim ke alamat ini. Pastikan kamu memiliki akses ke wallet tersebut.
                  </p>
                </div>
              )}
            />

            {/* Save button */}
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2"
              style={{ padding: '13px', fontSize: '13px', borderRadius: 8 }}
            >
              {isLoading ? (
                <><Loader2 size={15} className="animate-spin" /> Saving...</>
              ) : success ? (
                <><Check size={15} /> Saved!</>
              ) : (
                <>Save Configuration <ArrowRight size={15} /></>
              )}
            </Button>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg"
                  style={{ background: 'rgba(0,255,128,0.06)', border: '1px solid rgba(0,255,128,0.15)' }}
                >
                  <Check size={14} style={{ color: '#00ff80' }} />
                  <span className="font-mono text-xs" style={{ color: '#00ff80' }}>
                    Configuration updated successfully.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
