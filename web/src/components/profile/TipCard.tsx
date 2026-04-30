import { Zap, Lock, Check, MessageSquare, Loader2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '../ui/Button'

const AMOUNTS = [1, 5, 10, 25]

export function TipCard({ 
  profile,
  isConnected,
  isConfirmed,
  currentHash,
  isPending,
  isConfirming,
  error,
  handleTip,
  amount,
  setAmount,
  message,
  setMessage
}: any) {
  const [isCustom, setIsCustom] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-surface-2 border border-border rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-3 flex items-center justify-between border-b border-border bg-surface-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-pink" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
            Send Support
          </span>
        </div>
        {profile.isStakingEnabled && (
          <div className="flex items-center gap-1.5">
            <Lock size={10} className="text-text-muted" />
            <span className="font-mono text-[9px] text-text-muted">Via Vault</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        <AnimatePresence mode="wait">
          {isConfirmed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-4"
            >
              <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-[#00ff80]/10 border border-[#00ff80]/20">
                <Check size={24} color="#00ff80" />
              </div>
              <div>
                <h3 className="font-display text-2xl mb-1 text-text-primary">TIP SENT!</h3>
                <p className="font-mono text-xs text-text-secondary">
                  {currentHash?.slice(0, 10)}···{currentHash?.slice(-8)}
                </p>
              </div>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Send Another
              </Button>
            </motion.div>
          ) : (
            <motion.div key="form" className="space-y-5">
              {/* Amount selector */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest mb-3 text-text-muted">
                  Choose Amount (MON)
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      onClick={() => { setAmount(amt.toString()); setIsCustom(false) }}
                      className="amount-pill"
                      style={{
                        background: !isCustom && amount === amt.toString() ? 'rgba(0,245,255,0.06)' : 'var(--surface-3)',
                        border: `1px solid ${!isCustom && amount === amt.toString() ? 'rgba(0,245,255,0.25)' : 'var(--border)'}`,
                        borderRadius: 8,
                        padding: '12px 8px',
                      }}
                    >
                      <div
                        className="font-display text-xl leading-none"
                        style={{ color: !isCustom && amount === amt.toString() ? 'var(--cyan)' : 'var(--text-primary)', letterSpacing: '0.02em' }}
                      >
                        {amt}
                      </div>
                      <div className="font-mono text-[9px] uppercase tracking-widest mt-1 text-text-muted">
                        MON
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => { setIsCustom(true); setAmount('') }}
                    className="amount-pill"
                    style={{
                      background: isCustom ? 'rgba(255,45,120,0.06)' : 'var(--surface-3)',
                      border: `1px solid ${isCustom ? 'rgba(255,45,120,0.25)' : 'var(--border)'}`,
                      borderRadius: 8,
                      padding: '12px 8px',
                    }}
                  >
                    <div
                      className="font-display text-base leading-none"
                      style={{ color: isCustom ? 'var(--pink)' : 'var(--text-secondary)', letterSpacing: '0.02em' }}
                    >
                      ···
                    </div>
                    <div className="font-mono text-[9px] uppercase tracking-widest mt-1 text-text-muted">
                      Custom
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom input */}
              <AnimatePresence>
                {isCustom && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={amount}
                        onChange={e => {
                          const v = e.target.value.replace(/[^0-9.]/g, '')
                          if (v.split('.').length <= 2) setAmount(v)
                        }}
                        placeholder="0.00"
                        autoFocus
                        className="input font-display text-3xl text-center pr-16"
                        style={{
                          borderColor: 'rgba(255,45,120,0.3)',
                          paddingTop: 16,
                          paddingBottom: 16,
                          letterSpacing: '0.02em',
                        }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs uppercase tracking-widest text-text-muted">
                        MON
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message */}
              <div>
                <div className="relative">
                  <MessageSquare
                    size={14}
                    className="absolute top-3 left-3 text-text-muted"
                  />
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Leave a message (optional)..."
                    rows={3}
                    className="input pl-9"
                    style={{ resize: 'none', lineHeight: 1.6 }}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-3 py-2 rounded text-xs font-mono bg-pink/10 border border-pink/20 text-pink">
                  {error.message.includes('User rejected') ? 'Transaction rejected.' : 'Transaction failed. Try again.'}
                </div>
              )}

              {/* Submit */}
              <Button
                variant="primary"
                onClick={handleTip}
                disabled={isPending || isConfirming || !isConnected || !amount}
                className="w-full flex justify-center items-center gap-2"
                style={{ padding: '14px', fontSize: '14px', borderRadius: 8 }}
              >
                {isPending ? (
                  <><Loader2 size={16} className="animate-spin" /> Confirm in wallet...</>
                ) : isConfirming ? (
                  <><Loader2 size={16} className="animate-spin" /> Confirming on-chain...</>
                ) : !isConnected ? (
                  <>Connect Wallet to Tip</>
                ) : (
                  <>
                    Send {amount || '?'} MON
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>

              <p className="text-center font-mono text-[9px] uppercase tracking-widest text-text-muted">
                Secured by Monad Testnet · Direct on-chain transfer
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
