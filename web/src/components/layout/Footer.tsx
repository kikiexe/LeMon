import { Link } from '@tanstack/react-router'
import { Zap, ExternalLink } from 'lucide-react'

const LINKS = {
  Product: [
    { label: 'Explore', to: '/' },
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Widgets', to: '/dashboard' },
  ],
  Developers: [
    { label: 'API Docs', href: '#' },
    { label: 'Widget SDK', href: '#' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
  Network: [
    { label: 'Monad Explorer', href: '#' },
    { label: 'Vault Contract', href: '#' },
    { label: 'Audit Report', href: '#' },
  ],
}

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface-2)',
      padding: '4rem 0 2rem',
    }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center rounded-[3px]"
                style={{ background: 'var(--cyan)' }}>
                <Zap size={16} fill="#000" stroke="none" />
              </div>
              <span className="font-display text-xl tracking-wider" style={{ color: 'var(--text-primary)' }}>
                TIP<span style={{ color: 'var(--pink)' }}>FY</span>
              </span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: 280 }}>
              Web3 tipping protocol built on Monad.
              Transparent, permissionless, direct.
            </p>

            {/* Chain info */}
            <div className="flex flex-col gap-2">
              <StatusRow label="Network" value="Monad Testnet" active />
              <StatusRow label="Protocol" value="TipFy v1.0" />
              <StatusRow label="Vault" value="Aave V3 Fork" />
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.2em]"
                style={{ color: 'var(--text-muted)' }}>
                {group}
              </h4>
              <ul className="space-y-3">
                {items.map((item: any) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="text-sm transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm flex items-center gap-1.5 transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        {item.label}
                        <ExternalLink size={10} style={{ opacity: 0.5 }} />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.15em]"
            style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Tipfy Protocol. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Docs'].map(link => (
              <a
                key={link}
                href="#"
                className="font-mono text-[10px] uppercase tracking-[0.12em] transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function StatusRow({ label, value, active }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {active
        ? <span className="dot-live" style={{ flexShrink: 0 }} />
        : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--surface-4)', flexShrink: 0 }} />
      }
      <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span className="font-mono text-[9px]" style={{ color: active ? 'var(--cyan)' : 'var(--text-secondary)', marginLeft: 'auto' }}>
        {value}
      </span>
    </div>
  )
}
