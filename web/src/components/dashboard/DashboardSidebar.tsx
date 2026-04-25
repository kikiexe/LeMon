import type { LucideIcon } from 'lucide-react'

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

      <div className="mt-auto pt-6 border-t border-white/5">
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
