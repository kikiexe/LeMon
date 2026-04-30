import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'

export function ActiveVotingCard({ activeVoting, votedIndex, isVoting, handleVote }: {
  activeVoting: any,
  votedIndex: number | null,
  isVoting: boolean,
  handleVote: (index: number) => void
}) {
  const { isConnected } = useAccount()

  if (!activeVoting) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-surface-2 border border-border rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-3 flex items-center gap-2 border-b border-border bg-surface-3">
        <span className="dot-live" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-cyan">
          Live Poll
        </span>
      </div>

      <div className="p-5 space-y-4">
        <h3 className="font-display text-2xl text-text-primary tracking-wide">
          {activeVoting.title}
        </h3>

        <div className="space-y-2">
          {activeVoting.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              disabled={votedIndex !== null || isVoting || !isConnected}
              className="w-full p-4 rounded-lg text-left transition-all"
              style={{
                background: votedIndex === idx
                  ? 'rgba(0,245,255,0.08)'
                  : 'var(--surface-3)',
                border: `1px solid ${votedIndex === idx ? 'rgba(0,245,255,0.25)' : 'var(--border)'}`,
                color: votedIndex === idx ? 'var(--cyan)' : 'var(--text-primary)',
                cursor: votedIndex !== null || !isConnected ? 'not-allowed' : 'pointer',
                opacity: votedIndex !== null && votedIndex !== idx ? 0.4 : 1,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{option}</span>
                {votedIndex === idx && <Check size={15} className="text-cyan" />}
              </div>
            </button>
          ))}
        </div>

        {!isConnected && (
          <p className="font-mono text-[10px] uppercase tracking-widest text-center text-text-muted">
            Connect wallet to vote
          </p>
        )}
      </div>
    </motion.div>
  )
}
