import { Zap, ShieldCheck, Twitter, Globe, ExternalLink, TrendingUp, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '../ui/Badge'

export function ProfileHeader({ profile }: { profile: any }) {
  const [copiedAddr, setCopiedAddr] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(profile.walletAddress)
    setCopiedAddr(true)
    setTimeout(() => setCopiedAddr(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <div style={{
        height: 100,
        background: 'linear-gradient(135deg, rgba(0,245,255,0.08) 0%, rgba(255,45,120,0.06) 50%, rgba(191,90,242,0.06) 100%)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
      }}>
        <div className="retro-grid absolute inset-0 opacity-30" />
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-end justify-between" style={{ marginTop: -32 }}>
          <div style={{
            width: 72, height: 72,
            background: 'var(--surface-3)',
            border: '3px solid var(--surface-2)',
            borderRadius: 14,
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--surface-4)' }}>
                <Zap size={28} style={{ color: 'var(--cyan)', opacity: 0.5 }} />
              </div>
            )}
          </div>

          <Badge variant="cyan" style={{ marginBottom: 4 }}>
            <ShieldCheck size={10} className="mr-1 inline" />
            On-Chain Verified
          </Badge>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <h1 className="font-display text-3xl text-text-primary tracking-wide">
              {profile.displayName || 'Anonymous Creator'}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-cyan">@{profile.username}</span>
              <span className="text-border-strong">·</span>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1.5 font-mono text-xs transition-colors text-text-muted hover:text-text-secondary"
              >
                {profile.walletAddress.slice(0, 6)}···{profile.walletAddress.slice(-4)}
                {copiedAddr ? <Check size={11} className="text-cyan" /> : <Copy size={11} />}
              </button>
            </div>
          </div>

          {profile.bio && (
            <p className="text-text-secondary text-sm leading-relaxed">
              {profile.bio}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1">
            <SocialBtn icon={<Twitter size={14} />} href="#" />
            <SocialBtn icon={<Globe size={14} />} href="#" />
            <SocialBtn icon={<ExternalLink size={14} />} href="#" />

            {profile.isStakingEnabled && (
              <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink/10 border border-pink/20">
                <TrendingUp size={10} className="text-pink" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-pink">
                  3.5% APR Vault
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SocialBtn({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 flex items-center justify-center rounded-md transition-all bg-surface-3 border border-border text-text-secondary hover:text-cyan hover:border-cyan/20"
    >
      {icon}
    </a>
  )
}
