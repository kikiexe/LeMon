import type { LucideIcon } from 'lucide-react'
import { QrCode, ExternalLink, X, Download, Copy, Check } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuthStore } from '#/store/auth'
import { useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

interface DashboardSidebarProps {
  items: NavItem[]
  activeTab: string
  setActiveTab: (id: string) => void
}

const QRPortal = ({
  isOpen,
  onClose,
  profileUrl,
  username,
}: {
  isOpen: boolean
  onClose: () => void
  profileUrl: string
  username?: string
}) => {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  useEffect(() => setMounted(true), [])

  const downloadQR = () => {
    const svg = document.getElementById('qr-modal-svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 600
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, 600, 600)
      ctx.drawImage(img, 50, 50, 500, 500)
      const link = document.createElement('a')
      link.download = `${username}-tipfy-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-strong)',
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(0,245,255,0.08), 0 24px 48px rgba(0,0,0,0.5)',
            }}
          >
            {/* Top accent */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, var(--cyan), var(--pink))' }} />

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-2xl" style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                    SHARE PROFILE
                  </h3>
                  <p className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-secondary)' }}>
                    /u/{username}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded transition-all"
                  style={{
                    background: 'var(--surface-3)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* QR Code */}
              <div
                className="p-6 flex justify-center rounded-lg"
                style={{ background: '#fff' }}
              >
                <QRCodeSVG
                  id="qr-modal-svg"
                  value={profileUrl}
                  size={240}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              {/* URL display */}
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded font-mono text-xs"
                style={{
                  background: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span className="flex-1 truncate">{profileUrl}</span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={downloadQR} className="btn btn-secondary" style={{ gap: 8 }}>
                  <Download size={13} />
                  Download
                </button>
                <button onClick={copyLink} className="btn btn-primary" style={{ gap: 8 }}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export const DashboardSidebar = ({
  items,
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) => {
  const { user } = useAuthStore()
  const [showQR, setShowQR] = useState(false)
  const { data: balance } = useBalance({ address: user?.address as `0x${string}` })

  const profileUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/u/${user?.slug}`
      : `https://tipfy.io/u/${user?.slug}`

  const truncated = user?.address
    ? `${user.address.slice(0, 6)}···${user.address.slice(-4)}`
    : '0x000···0000'

  return (
    <aside
      className="hidden lg:flex flex-col w-60 py-8 px-4 sticky top-16 h-[calc(100vh-64px)] shrink-0"
      style={{ borderRight: '1px solid var(--border)' }}
    >
      {/* Nav */}
      <div className="space-y-1 flex-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] px-3 mb-4"
          style={{ color: 'var(--text-muted)' }}>
          Navigation
        </p>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-left"
            style={{
              background: activeTab === item.id ? 'rgba(0,245,255,0.05)' : 'transparent',
              border: `1px solid ${activeTab === item.id ? 'rgba(0,245,255,0.12)' : 'transparent'}`,
              color: activeTab === item.id ? 'var(--cyan)' : 'var(--text-secondary)',
            }}
          >
            <item.icon size={15} />
            <span className="text-xs font-semibold uppercase tracking-[0.08em]">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto w-1 h-1 rounded-full" style={{ background: 'var(--cyan)' }} />
            )}
          </button>
        ))}
      </div>

      {/* Bottom info */}
      <div className="space-y-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        {/* Wallet info */}
        <div
          className="p-3 rounded-lg space-y-3"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Wallet
            </p>
            <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              {truncated}
            </p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              Balance
            </p>
            <p className="font-display text-xl" style={{ color: 'var(--cyan)', letterSpacing: '0.02em' }}>
              {balance?.value ? Number(formatEther(balance.value)).toFixed(4) : '0.0000'}
              <span className="font-mono text-[10px] ml-1" style={{ color: 'var(--text-muted)' }}>
                {balance?.symbol || 'MON'}
              </span>
            </p>
          </div>
        </div>

        {/* QR share */}
        {user?.slug && (
          <>
            <button
              onClick={() => setShowQR(true)}
              className="w-full p-3 rounded-lg transition-all group text-left"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Share Profile
                </p>
                <QrCode size={12} style={{ color: 'var(--cyan)' }} />
              </div>
              <div className="flex justify-center p-2 rounded" style={{ background: '#fff' }}>
                <QRCodeSVG
                  value={profileUrl}
                  size={96}
                  level="H"
                  includeMargin={false}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-mono text-[9px] truncate" style={{ color: 'var(--text-secondary)' }}>
                  /u/{user.slug}
                </span>
                <ExternalLink size={10} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            </button>

            <QRPortal
              isOpen={showQR}
              onClose={() => setShowQR(false)}
              profileUrl={profileUrl}
              username={user.slug}
            />
          </>
        )}

        {/* Status */}
        <div
          className="px-3 py-2 rounded flex items-center gap-2"
          style={{ background: 'rgba(0,255,128,0.04)', border: '1px solid rgba(0,255,128,0.1)' }}
        >
          <span className="dot-live" />
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: '#00ff80' }}>
            Node Connected
          </span>
        </div>
      </div>
    </aside>
  )
}
