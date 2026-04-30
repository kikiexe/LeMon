import { createFileRoute, notFound } from '@tanstack/react-router'
import { getPublicProfileServerFn } from '../lib/auth-utils'
import { getActiveVotingServerFn, submitVoteServerFn } from '../lib/overlay-utils'
import { TipFyVaultABI, TIPFY_VAULT_ADDRESS } from '../lib/TipFyVaultABI'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { useState, useEffect, useRef } from 'react'
import { useSendTransaction, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { ActiveVotingCard } from '../components/profile/ActiveVotingCard'
import { TipCard } from '../components/profile/TipCard'

export const Route = createFileRoute('/u/$username')({
  loader: async ({ params }) => {
    const profile = await getPublicProfileServerFn({ data: params.username })
    if (!profile) throw notFound()
    const activeVoting = await getActiveVotingServerFn({ data: { profileId: profile.id } })
    return { profile, activeVoting }
  },
  component: PublicProfilePage,
})

function PublicProfilePage() {
  const { profile, activeVoting } = Route.useLoaderData()
  const { isConnected, address: senderAddress } = useAccount()

  const [amount, setAmount] = useState('5')
  const [message, setMessage] = useState('')
  const [votedIndex, setVotedIndex] = useState<number | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const hasRecorded = useRef(false)

  const { data: hash, sendTransaction, isPending: isSendPending, error: sendError } = useSendTransaction()
  const { data: writeHash, writeContract, isPending: isWritePending, error: writeError } = useWriteContract()

  const currentHash = hash || writeHash
  const isPending = isSendPending || isWritePending
  const error = sendError || writeError

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: currentHash })

  useEffect(() => {
    if (isConfirmed && currentHash && !hasRecorded.current) {
      hasRecorded.current = true
      fetch('/api/donation/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: profile.username, senderAddress, amount, txHash: currentHash, message }),
      }).catch(console.error)
    }
  }, [isConfirmed, currentHash])

  const handleTip = () => {
    if (!isConnected || !profile.walletAddress || !amount) return
    hasRecorded.current = false
    const target = (profile.payoutAddress || profile.walletAddress) as `0x${string}`

    if (profile.isStakingEnabled) {
      writeContract({
        address: TIPFY_VAULT_ADDRESS,
        abi: TipFyVaultABI,
        functionName: 'donate',
        args: [target, 'Anon', message || 'Support', ''],
        value: parseEther(amount),
      })
    } else {
      sendTransaction({ to: target, value: parseEther(amount) })
    }
  }

  const handleVote = async (index: number) => {
    if (!isConnected || !activeVoting || isVoting) return
    setIsVoting(true)
    try {
      await (submitVoteServerFn as any)({ data: { votingId: (activeVoting as any).id, optionIndex: index, voterAddress: senderAddress } })
      setVotedIndex(index)
    } catch (err: any) {
      alert(err.message === 'Already voted' ? 'Kamu sudah vote di sesi ini.' : 'Gagal mengirim vote.')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-1">
      <Navbar />

      <main className="flex-1 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 300,
            background: 'radial-gradient(ellipse, rgba(0,245,255,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-16 relative z-10 space-y-6">
          <ProfileHeader profile={profile} />
          
          <ActiveVotingCard 
            activeVoting={activeVoting} 
            votedIndex={votedIndex} 
            isVoting={isVoting} 
            handleVote={handleVote} 
          />

          <TipCard 
            profile={profile}
            isConnected={isConnected}
            isConfirmed={isConfirmed}
            currentHash={currentHash}
            isPending={isPending}
            isConfirming={isConfirming}
            error={error}
            handleTip={handleTip}
            amount={amount}
            setAmount={setAmount}
            message={message}
            setMessage={setMessage}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
