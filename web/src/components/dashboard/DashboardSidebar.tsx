import type { LucideIcon } from 'lucide-react'
import { QrCode, ExternalLink, Wallet, X, Download } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useAuthStore } from '#/store/auth'
import { useBalance } from 'wagmi'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

export const DashboardSidebar = ({
  items,
  activeTab,
  setActiveTab,
}: DashboardSidebarProps) => {
  const { user } = useAuthStore()
  const [showQRModal, setShowQRModal] = useState(false)
  const { data: balance } = useBalance({
    address: user?.address as `0x${string}`,
  })

  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/u/${user?.slug}`
    : `https://tipfy.io/u/${user?.slug}`

  const truncatedAddress = user?.address 
    ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
    : '0x000...0000'

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `${user?.slug}-tip-qr.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 py-12 px-6 sticky top-20 h-[calc(100vh-80px)]">
      <div className="space-y-2">
        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-6">
          CREATOR_CONTROL
        </p>
        {items.map((item: NavItem) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-4 transition-all group skew-x--5 ${
              activeTab === item.id
                ? 'bg-white/5 border border-white/10'
                : 'hover:bg-white/2 border border-transparent'
            }`}
          >
            <div
              className={`skew-x-5 flex items-center gap-4 ${
                activeTab === item.id
                  ? item.color
                  : 'text-neutral-500 group-hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span
                className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-neutral-500 group-hover:text-neutral-300'
                }`}
              >
                {item.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
        {/* Wallet Info */}
        <div className="p-4 bg-white/2 border border-white/5 skew-x--5">
          <div className="skew-x-5 space-y-3">
            <div>
              <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">
                Connected_Wallet
              </p>
              <p className="text-[10px] font-mono text-white flex items-center gap-2">
                <Wallet size={10} className="text-neon-pink" />
                {truncatedAddress}
              </p>
            </div>
            <div>
              <p className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">
                Wallet_Balance
              </p>
              <p className="text-[12px] font-black text-neon-cyan italic">
                {balance?.formatted ? Number(balance.formatted).toFixed(4) : '0.0000'}
                <span className="ml-1 text-[8px] font-mono opacity-70">{balance?.symbol || 'MON'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        {user?.slug && (
          <div 
            onClick={() => setShowQRModal(true)}
            className="p-4 bg-white/5 border border-white/10 skew-x--5 group relative overflow-hidden cursor-pointer hover:border-neon-cyan/50 transition-all"
          >
             <div className="absolute top-0 right-0 w-16 h-16 bg-neon-cyan/5 -mr-8 -mt-8 rotate-45 group-hover:bg-neon-cyan/10 transition-colors" />
            <div className="skew-x-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-black text-neon-cyan uppercase tracking-widest">
                  Share_Profile
                </p>
                <QrCode size={12} className="text-neon-cyan animate-pulse" />
              </div>
              
              <div className="p-2 flex justify-center group-hover:scale-105 transition-transform">
                <QRCodeSVG 
                  value={profileUrl}
                  size={120}
                  level="H"
                  includeMargin={false}
                  bgColor="transparent"
                  fgColor="#00f3ff"
                />
              </div>

              <div className="flex items-center justify-between text-[8px] font-black text-neutral-400 uppercase tracking-widest group-hover:text-neon-cyan transition-colors">
                <span className="truncate mr-2">/u/{user.slug}</span>
                <ExternalLink size={10} />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showQRModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowQRModal(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-cyber-dark border border-neon-cyan shadow-[0_0_50px_rgba(0,243,255,0.2)] p-8 skew-x--2"
              >
                <div className="skew-x-2 space-y-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Profile_<span className="text-neon-cyan">QR</span></h3>
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mt-1">Scan to support /u/{user?.slug}</p>
                    </div>
                    <button 
                      onClick={() => setShowQRModal(false)}
                      className="p-2 hover:bg-white/5 text-neutral-500 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-8 flex justify-center relative group">
                    <QRCodeSVG 
                      id="qr-code-svg"
                      value={profileUrl}
                      size={280}
                      level="H"
                      includeMargin={false}
                      bgColor="transparent"
                      fgColor="#00f3ff"
                    />
                    <div className="absolute inset-0 border border-neon-cyan/20 pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={downloadQR}
                      className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 hover:border-neon-cyan/50 text-white text-[10px] font-black uppercase tracking-widest transition-all skew-x--10 group"
                    >
                      <Download size={14} className="group-hover:text-neon-cyan" />
                      <span className="skew-x-10">Download PNG</span>
                    </button>
                    <a 
                      href={profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-4 bg-neon-cyan text-black text-[10px] font-black uppercase tracking-widest transition-all skew-x--10 hover:bg-white"
                    >
                      <ExternalLink size={14} />
                      <span className="skew-x-10">Visit Profile</span>
                    </a>
                  </div>

                  <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/20">
                    <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed text-center">
                      Point your camera or wallet app at the code to open the donation portal.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Node Status */}
        <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/10 skew-x--5">
          <div className="skew-x-5">
            <p className="text-[8px] font-black text-neon-cyan uppercase tracking-widest mb-1">
              Node_Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white italic">
                CONNECTED
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
