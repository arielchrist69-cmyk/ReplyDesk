import {
  Users,
  Inbox,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Menu,
} from 'lucide-react';
import type { View } from '../types';
import type { TicketWithDetails } from '../lib/api';
import { statusLabels, statusStyles, priorityLabels, priorityStyles, initials, avatarColor } from '../utils';

interface Props {
  tickets: TicketWithDetails[];
  customersCount: number;
  activeCustomersCount: number;
  onNavigate: (view: View) => void;
  onOpenTicket: (ticket: TicketWithDetails) => void;
  onOpenMobileMenu: () => void;
}

export default function DashboardPage({
  tickets,
  customersCount,
  activeCustomersCount,
  onNavigate,
  onOpenTicket,
  onOpenMobileMenu,
}: Props) {
  const open = tickets.filter((t) => t.status === 'ouvert').length;
  const resolved = tickets.filter((t) => t.status === 'resolu').length;
  const pending = tickets.filter((t) => t.status === 'en_attente').length;

  const stats = [
    {
      label: 'Clients actifs',
      value: activeCustomersCount,
      icon: Users,
      hint: `${customersCount} clients au total`,
      accent: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Tickets ouverts',
      value: open,
      icon: Inbox,
      hint: `${tickets.length} tickets au total`,
      accent: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Tickets résolus',
      value: resolved,
      icon: CheckCircle2,
      hint: 'Depuis la création du compte',
      accent: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Demandes en attente',
      value: pending,
      icon: Clock,
      hint: 'Réponse sous 24 h garantie',
      accent: 'bg-rose-50 text-rose-600',
    },
  ];

  const recent = tickets.slice(0, 5);

  return (
    <div>
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0B1B33] tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-slate-500 mt-0.5">Voici un aperçu de votre activité.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, hint, accent }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md hover:shadow-slate-200/60 transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
                <Icon className="w-5 h-5" />
              </span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-[#0B1B33] tracking-tight">{value}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
            <p className="text-xs text-slate-400 mt-2">{hint}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-[#0B1B33]">Activité récente</h2>
          <button
            onClick={() => onNavigate('tickets')}
            className="text-sm font-medium text-[#2E6BFF] hover:text-[#1D4FD8] transition flex items-center gap-1"
          >
            Tout voir
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {recent.map((t) => {
            const name = t.customer?.name ?? 'Client inconnu';
            return (
              <button
                key={t.id}
                onClick={() => onOpenTicket(t)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition text-left"
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(t.customer_id)}`}
                >
                  {initials(name)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B1B33] truncate">{t.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {name} · maj {new Date(t.updated_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                <span className={`hidden sm:inline text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${statusStyles[t.status]}`}>
                  {statusLabels[t.status]}
                </span>
                <span className={`hidden md:inline text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${priorityStyles[t.priority]}`}>
                  {priorityLabels[t.priority]}
                </span>
              </button>
            );
          })}
          {recent.length === 0 && (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-slate-500">Aucun ticket pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
