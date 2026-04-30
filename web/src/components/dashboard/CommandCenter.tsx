import { motion } from 'framer-motion'
import { StatCard } from '../ui/StatCard'
import { FeedItem } from './FeedItem'
import {
  Zap, ExternalLink, Wallet,
  TrendingUp, Users, Activity, Lock,
  Coins, ArrowDownCircle, Loader2, Terminal,
} from 'lucide-react'
import { Link, Await } from '@tanstack/react-router'
import { Suspense, useMemo } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { TipFyVaultABI, TIPFY_VAULT_ADDRESS } from '../../lib/TipFyVaultABI'
import { Button } from '../ui/Button'

interface CommandCenterProps {
  user: any
  deferredStats: any
  deferredDonations: any
  isStakingEnabled?: boolean
}

export const CommandCenter = ({
  user,
  deferredStats,
  deferredDonations,
  isStakingEnabled,
}: CommandCenterProps) => {
  const { address } = useAccount()
  const chartFallback = [20, 35, 28, 50, 42, 65, 58, 72, 60, 80, 70, 90]

  const { data: vaultBalance } = useReadContract({
    address: TIPFY_VAULT_ADDRESS,
    abi: TipFyVaultABI,
    functionName: 'balances',
    args: [address as `0x${string}`],
    query: { enabled: !!address && !!isStakingEnabled },
  })
  const { data: accruedYield } = useReadContract({
    address: TIPFY_VAULT_ADDRESS,
    abi: TipFyVaultABI,
    functionName: 'calculateYield',
    args: [address as `0x${string}`],
    query: { enabled: !!address && !!isStakingEnabled },
  })
  const { data: lastStakeTime } = useReadContract({
    address: TIPFY_VAULT_ADDRESS,
    abi: TipFyVaultABI,
    functionName: 'lastStakeTimestamp',
    args: [address as `0x${string}`],
    query: { enabled: !!address && !!isStakingEnabled },
  })
  const { data: stakeDuration } = useReadContract({
    address: TIPFY_VAULT_ADDRESS,
    abi: TipFyVaultABI,
    functionName: 'STAKE_DURATION',
    query: { enabled: !!isStakingEnabled },
  })

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const handleWithdraw = () => {
    if (!vaultBalance || Number(vaultBalance) === 0) return
    writeContract({ address: TIPFY_VAULT_ADDRESS, abi: TipFyVaultABI, functionName: 'withdraw', args: [vaultBalance] })
  }
  const handleClaimYield = () => {
    writeContract({ address: TIPFY_VAULT_ADDRESS, abi: TipFyVaultABI, functionName: 'claimYield' })
  }

  const maturityInfo = useMemo(() => {
    if (!lastStakeTime || !stakeDuration || Number(lastStakeTime) === 0) return 'No Active Stake'
    const diff = Number(lastStakeTime) + Number(stakeDuration) - Math.floor(Date.now() / 1000)
    if (diff <= 0) return 'Matured — Claim Ready'
    return `${Math.ceil(diff / 86400)} days remaining`
  }, [lastStakeTime, stakeDuration])

  const canClaim = useMemo(() =>
    !!(accruedYield && Number(accruedYield) > 0 && maturityInfo === 'Matured — Claim Ready'),
    [accruedYield, maturityInfo])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* ── Header ── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="dot-live" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--cyan)' }}>
              {isStakingEnabled ? 'Vault Staking Active' : 'Overview'}
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl" style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            DASH<span style={{ color: 'var(--pink)' }}>BOARD</span>
          </h1>
        </div>

        <div className="flex gap-3">
          {user?.slug && (
            <Link
              to="/u/$username"
              params={{ username: user.slug }}
              className="btn btn-secondary"
              style={{ gap: 8 }}
            >
              <ExternalLink size={14} />
              Public Profile
            </Link>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0,1,2].map(i => (
              <div key={i} className="skeleton h-36 rounded-xl" />
            ))}
          </div>
        }
      >
        <Await promise={deferredStats}>
          {(stats: any) => (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={<Wallet size={16} />}
                  label="Total Earnings"
                  value={Number(stats.totalEarnings || 0).toLocaleString()}
                  unit="MON"
                  trend="Cumulative all-time"
                  color="var(--cyan)"
                />
                <StatCard
                  icon={<TrendingUp size={16} />}
                  label="Total Transactions"
                  value={(stats.totalDonations || 0).toString()}
                  unit="Tips"
                  trend="All time"
                  color="var(--pink)"
                />
                <StatCard
                  icon={<Users size={16} />}
                  label="Unique Supporters"
                  value={(stats.uniqueWallets || 0).toString()}
                  unit="Wallets"
                  trend="Community"
                  color="var(--purple)"
                />
              </div>

              {/* Vault Panel */}
              {isStakingEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(255,45,120,0.04)',
                    border: '1px solid rgba(255,45,120,0.15)',
                    borderRadius: 12,
                    padding: '1.5rem',
                  }}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-wrap gap-8">
                      <VaultStat
                        label="Vault Balance"
                        value={vaultBalance ? Number(formatEther(vaultBalance)).toFixed(4) : '0.0000'}
                        unit="MON"
                        icon={<Lock size={14} />}
                        color="var(--text-primary)"
                      />
                      <VaultStat
                        label="Accrued Yield"
                        value={`+${accruedYield ? Number(formatEther(accruedYield)).toFixed(6) : '0.000000'}`}
                        unit="MON"
                        icon={<Coins size={14} />}
                        color="#00ff80"
                      />
                      <VaultStat
                        label="Maturity"
                        value={maturityInfo}
                        icon={<Zap size={14} />}
                        color="var(--text-secondary)"
                        small
                      />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <Button
                        variant="secondary"
                        onClick={handleWithdraw}
                        disabled={isPending || isConfirming || !vaultBalance || Number(vaultBalance) === 0}
                        className="flex-1 md:flex-none flex items-center justify-center"
                        style={{ gap: 8 }}
                      >
                        {(isPending || isConfirming)
                          ? <Loader2 size={14} className="animate-spin" />
                          : <ArrowDownCircle size={14} />}
                        Withdraw
                      </Button>
                      <button
                        onClick={handleClaimYield}
                        disabled={!canClaim || isPending || isConfirming}
                        className="btn flex-1 md:flex-none"
                        style={{
                          gap: 8,
                          background: canClaim ? 'rgba(0,255,128,0.08)' : 'var(--surface-3)',
                          color: canClaim ? '#00ff80' : 'var(--text-muted)',
                          border: `1px solid ${canClaim ? 'rgba(0,255,128,0.25)' : 'var(--border)'}`,
                          cursor: canClaim ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <Zap size={14} />
                        Claim Yield
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </Await>
      </Suspense>

      {/* ── Chart + Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart */}
        <div className="lg:col-span-8 card" style={{ padding: '1.5rem' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity size={16} style={{ color: 'var(--cyan)' }} />
              <span className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>
                Donation History
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="dot-live" />
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'var(--cyan)' }}>Live</span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="h-48 flex items-end gap-1.5 md:gap-2 px-1">
            <Suspense fallback={
              <div className="flex items-end gap-2 w-full h-full">
                {chartFallback.map((_, i) => (
                  <div key={i} className="flex-1 skeleton" style={{ height: '60%' }} />
                ))}
              </div>
            }>
              <Await promise={deferredDonations}>
                {(donations: any[]) => {
                  const data = donations?.slice(0, 12).reverse() || []
                  const maxAmt = Math.max(...data.map(d => Number(d.amount)), 1)

                  const items = data.length > 0 ? data : chartFallback.map((v, i) => ({ id: i, amount: v, placeholder: true }))
                  const max = data.length > 0 ? maxAmt : Math.max(...chartFallback)

                  return items.map((d: any, i: number) => {
                    const height = d.placeholder ? `${d}%` : `${Math.max((Number(d.amount) / max) * 100, 5)}%`
                    return (
                      <motion.div
                        key={d.id ?? i}
                        initial={{ height: 0 }}
                        animate={{ height }}
                        transition={{ delay: i * 0.04, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="flex-1 relative group cursor-pointer rounded-[2px]"
                        style={{
                          background: d.placeholder
                            ? 'var(--surface-3)'
                            : 'linear-gradient(to top, rgba(0,245,255,0.6) 0%, rgba(0,245,255,0.2) 100%)',
                          border: d.placeholder ? '1px solid var(--border)' : '1px solid rgba(0,245,255,0.2)',
                        }}
                      >
                        {!d.placeholder && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            <span className="font-mono text-[9px]" style={{ color: 'var(--cyan)' }}>{d.amount} MON</span>
                          </div>
                        )}
                      </motion.div>
                    )
                  })
                }}
              </Await>
            </Suspense>
          </div>

          <div className="flex justify-between mt-3 px-1">
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Oldest</span>
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Latest</span>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-4 card" style={{ padding: 0, display: 'flex', flexDirection: 'column', maxHeight: 360 }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <Terminal size={14} style={{ color: 'var(--pink)' }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>
              Activity Feed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
            <Suspense fallback={
              <div className="space-y-3">
                {[0,1,2].map(i => <div key={i} className="skeleton h-12 rounded" />)}
              </div>
            }>
              <Await promise={deferredDonations}>
                {(donations: any) => (
                  <>
                    {donations?.length > 0
                      ? donations.slice(0, 10).map((item: any) => (
                          <FeedItem
                            key={item.id}
                            user={item.senderName || item.senderAddress?.slice(0, 8) || 'Anon'}
                            msg={`${item.amount} ${item.currency} — ${item.message || 'No message'}`}
                            type="tip"
                          />
                        ))
                      : (
                          <>
                            <FeedItem user="system" msg="Feed connected." type="info" />
                            <FeedItem user="system" msg="Waiting for first donation..." type="info" />
                          </>
                        )
                    }
                  </>
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function VaultStat({ label, value, unit, icon, color, small }: {
  label: string; value: string; unit?: string; icon: React.ReactNode;
  color: string; small?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={small ? 'font-mono text-sm font-medium' : 'font-display text-2xl'}
          style={{ color, letterSpacing: small ? 0 : '0.02em' }}
        >
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>{unit}</span>
        )}
      </div>
    </div>
  )
}
