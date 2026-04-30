import { createFileRoute } from '@tanstack/react-router'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Zap, Shield, Globe, ArrowRight, Terminal, ChevronRight } from 'lucide-react'
import { Navbar } from '#/components/layout/Navbar'
import { Footer } from '#/components/layout/Footer'
import { Button } from '#/components/ui/Button'
import { Badge } from '#/components/ui/Badge'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const STATS = [
  { label: 'Total Volume',    value: '$2.4M+',  color: 'var(--cyan)' },
  { label: 'Active Creators', value: '1,200+',  color: 'var(--pink)' },
  { label: 'Total Tips',      value: '45K+',    color: 'var(--yellow)' },
  { label: 'Network',         value: 'MONAD',   color: '#fff' },
]

const FEATURES = [
  {
    icon: <Zap size={18} />,
    label: 'Instant Settlement',
    desc: 'Donasi masuk langsung ke wallet-mu. Zero intermediaries, zero delay.',
    color: 'var(--cyan)',
    bg: 'rgba(0,245,255,0.05)',
    border: 'rgba(0,245,255,0.12)',
  },
  {
    icon: <Shield size={18} />,
    label: 'On-Chain Verified',
    desc: 'Setiap transaksi tercatat permanen di blockchain. Transparan total.',
    color: 'var(--pink)',
    bg: 'rgba(255,45,120,0.05)',
    border: 'rgba(255,45,120,0.12)',
  },
  {
    icon: <Globe size={18} />,
    label: 'Global & Permissionless',
    desc: 'Terima dukungan dari seluruh dunia tanpa rekening bank atau approval.',
    color: 'var(--purple)',
    bg: 'rgba(191,90,242,0.05)',
    border: 'rgba(191,90,242,0.12)',
  },
]

const STEPS = [
  { n: '01', title: 'Connect Wallet',    desc: 'Sign in dengan Web3 wallet favoritmu. Identity-mu adalah private key-mu.' },
  { n: '02', title: 'Setup Profile',     desc: 'Buat Tipfy URL-mu dan hubungkan socials untuk mulai menerima tips.' },
  { n: '03', title: 'Receive On-Chain',  desc: 'Setiap tip adalah transaksi blockchain yang langsung dan aman.' },
]

function LandingPage() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-1)' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background grid */}
        <div className="retro-grid absolute inset-0 opacity-40" />

        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,245,255,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,45,120,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <Badge variant="cyan">
              <span className="dot-live" style={{ width: 6, height: 6 }} />
              Tipfy Protocol v1.0
            </Badge>
            <Badge variant="neutral">
              Monad Testnet
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display mb-6"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', lineHeight: 1.0, color: 'var(--text-primary)', letterSpacing: '0.02em' }}
          >
            FUTURE OF
            <br />
            <span
              className="glitch-text"
              data-text="SUPPORTING"
              style={{ color: 'var(--cyan)', WebkitTextStroke: '1px rgba(0,245,255,0.3)' }}
            >
              SUPPORTING
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}
          >
            Jembatan masa depan bagi kreator dan pendukung.
            Transparansi on-chain, tanpa perantara.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button variant="primary" style={{ padding: '14px 32px', fontSize: '14px', borderRadius: '4px' }}>
              Get Started <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" style={{ padding: '14px 32px', fontSize: '14px', borderRadius: '4px' }}>
              Explore Network
            </Button>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, var(--cyan))', opacity: 0.4 }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS TICKER ── */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', overflow: 'hidden' }}>
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          className="flex gap-0 whitespace-nowrap py-4"
        >
          {[...STATS, ...STATS, ...STATS].map((s, i) => (
            <div key={i} className="flex items-center gap-6 px-10">
              <span className="font-display text-2xl" style={{ color: s.color }}>{s.value}</span>
              <span className="font-mono text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
              <span style={{ color: 'var(--border-strong)', fontSize: 20 }}>·</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── FEATURES ── */}
      <section className="py-28 px-6 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--text-secondary)' }}>
            Why Tipfy
          </p>
          <h2 className="font-display text-5xl md:text-6xl" style={{ color: 'var(--text-primary)' }}>
            BUILT FOR<br />
            <span style={{ color: 'var(--cyan)' }}>CREATORS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{
                background: f.bg,
                border: `1px solid ${f.border}`,
                borderRadius: 8,
                padding: '2rem',
                transition: 'all 200ms',
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded mb-5"
                style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}25` }}
              >
                {f.icon}
              </div>
              <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                {f.label.toUpperCase()}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        className="py-28 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={14} style={{ color: 'var(--cyan)' }} />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
                  Protocol Workflow
                </span>
              </div>
              <h2 className="font-display text-5xl md:text-6xl" style={{ color: 'var(--text-primary)' }}>
                HOW IT<br />
                <span style={{ color: 'var(--pink)' }}>WORKS</span>
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 300, fontSize: '14px', lineHeight: 1.7 }}>
              Tiga langkah sederhana untuk mulai menerima dukungan on-chain.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px"
            style={{ background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: 'var(--surface-2)', padding: '2.5rem' }}
                className="relative group hover:bg-(--surface-3) transition-colors"
              >
                <div className="font-display text-6xl mb-6" style={{ color: 'var(--border-strong)', lineHeight: 1 }}>
                  {step.n}
                </div>
                <h3 className="font-display text-2xl mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                  {step.title.toUpperCase()}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
                  {step.desc}
                </p>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={16} style={{ color: 'var(--cyan)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: 'var(--surface-1)' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            width: 600, height: 300, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,45,120,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <Badge variant="pink" className="mb-8 inline-flex">
            Ready to Start?
          </Badge>
          <h2 className="font-display mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: 'var(--text-primary)', lineHeight: 1 }}>
            JOIN THE{' '}
            <span style={{ color: 'var(--cyan)' }}>WEB3</span>{' '}
            CREATOR ECONOMY
          </h2>
          <p className="mb-10" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Stop letting platforms take your revenue.
            Start your Tipfy profile today — free forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" style={{ padding: '16px 40px', fontSize: '14px', borderRadius: '4px' }}>
              Create Your Profile <ArrowRight size={16} />
            </Button>
            <Button variant="secondary" style={{ padding: '16px 40px', fontSize: '14px', borderRadius: '4px' }}>
              View Demo
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
