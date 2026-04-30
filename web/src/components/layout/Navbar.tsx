import { Link } from '@tanstack/react-router'
import { WalletAuth } from './WalletAuth'
import { ProfileModal } from './ProfileModal'
import { LayoutDashboard, Home, User, Zap } from 'lucide-react'
import { useAuthStore } from '../../store/auth'
import { useUIStore } from '../../store/ui'

export const Navbar = () => {
  const { user } = useAuthStore()
  const { setShowProfile } = useUIStore()

  return (
    <>
      <nav className="sticky top-0 z-100 w-full border-b border-[var(--border)] bg-[var(--surface-1)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-[var(--cyan)] flex items-center justify-center rounded-[3px] transition-all group-hover:shadow-[0_0_16px_rgba(0,245,255,0.4)]">
              <Zap size={16} fill="#000" stroke="none" />
            </div>
            <span className="font-display text-xl tracking-wider text-[var(--text-primary)] group-hover:text-[var(--cyan)] transition-colors">
              TIP<span className="text-[var(--pink)]">FY</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            <NavLink to="/" icon={<Home size={14} />} label="Explore" />
            {user && (
              <NavLink to="/dashboard" icon={<LayoutDashboard size={14} />} label="Dashboard" />
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)]">
              <span className="dot-live" />
              <span className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-widest">Monad</span>
            </div>

            {user && (
              <button
                onClick={() => setShowProfile(true)}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--cyan)] hover:border-[rgba(0,245,255,0.3)] transition-all"
              >
                <User size={15} />
              </button>
            )}
            <WalletAuth />
          </div>
        </div>
      </nav>

      <ProfileModal />
    </>
  )
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="nav-link [&.active]:active"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
