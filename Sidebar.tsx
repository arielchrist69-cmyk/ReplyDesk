import {
  MessageSquareText,
  LayoutDashboard,
  Users,
  Inbox,
  LogOut,
  X,
} from 'lucide-react';
import type { View } from '../types';
import { initials } from '../utils';

interface Props {
  view: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  openTickets: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  user: { name: string; email: string };
}

const navItems: { view: View; label: string; icon: typeof LayoutDashboard }[] = [
  { view: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { view: 'customers', label: 'Clients', icon: Users },
  { view: 'tickets', label: 'Boîte de réception', icon: Inbox },
];

export default function Sidebar({
  view,
  onNavigate,
  onLogout,
  openTickets,
  mobileOpen,
  onCloseMobile,
  user,
}: Props) {
  const content = (
    <div className="h-full flex flex-col bg-[#0B1B33] text-white w-64">
      <div className="flex items-center justify-between px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[#2E6BFF] flex items-center justify-center">
            <MessageSquareText className="w-5 h-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">ReplyDesk</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-white/60 hover:text-white transition p-1"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ view: v, label, icon: Icon }) => {
          const active = view === v || (view === 'ticket-detail' && v === 'tickets');
          return (
            <button
              key={v}
              onClick={() => onNavigate(v)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="flex-1 text-left">{label}</span>
              {v === 'tickets' && openTickets > 0 && (
                <span className="text-xs font-semibold bg-[#2E6BFF] px-2 py-0.5 rounded-full">
                  {openTickets}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 pb-3">
          <span className="w-9 h-9 rounded-full bg-[#2E6BFF]/25 text-[#8FB4FF] flex items-center justify-center text-sm font-bold">
            {initials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-xs text-white/50 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0">{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-[#0B1B33]/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="absolute inset-y-0 left-0 shadow-2xl">{content}</div>
        </div>
      )}
    </>
  );
}
