import { useState } from 'react';
import { Menu, Search, Filter, ArrowUpRight } from 'lucide-react';
import type { View, TicketStatus } from '../types';
import type { TicketWithDetails } from '../lib/api';
import { statusLabels, statusStyles, priorityLabels, priorityStyles, initials, avatarColor } from '../utils';

interface Props {
  tickets: TicketWithDetails[];
  onNavigate: (view: View) => void;
  onOpenTicket: (ticket: TicketWithDetails) => void;
  onOpenMobileMenu: () => void;
}

const filters: { key: TicketStatus | 'tous'; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'ouvert', label: 'Ouverts' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'en_attente', label: 'En attente' },
  { key: 'resolu', label: 'Résolus' },
];

export default function TicketsPage({ tickets, onNavigate, onOpenTicket, onOpenMobileMenu }: Props) {
  const [status, setStatus] = useState<TicketStatus | 'tous'>('tous');
  const [query, setQuery] = useState('');

  const filtered = tickets
    .filter((t) => status === 'tous' || t.status === status)
    .filter((t) => {
      const c = t.customer;
      return `${t.subject} ${c?.name ?? ''} ${c?.company ?? ''}`
        .toLowerCase()
        .includes(query.toLowerCase());
    });

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
          <h1 className="text-2xl font-bold text-[#0B1B33] tracking-tight">Boîte de réception</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {tickets.filter((t) => t.status !== 'resolu').length} tickets nécessitent votre attention
          </p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un ticket, un client…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition bg-white"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                status === key
                  ? 'bg-[#0B1B33] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map((t) => {
            const c = t.customer;
            const name = c?.name ?? 'Client inconnu';
            const lastMessage = t.messages[t.messages.length - 1];
            const unread = t.status === 'ouvert';
            return (
              <button
                key={t.id}
                onClick={() => onOpenTicket(t)}
                className="w-full flex items-start gap-4 px-6 py-5 hover:bg-slate-50 transition text-left"
              >
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(t.customer_id)}`}
                >
                  {initials(name)}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {unread && <span className="w-2 h-2 rounded-full bg-[#2E6BFF] shrink-0" />}
                    <p className={`text-sm truncate ${unread ? 'font-bold text-[#0B1B33]' : 'font-semibold text-[#0B1B33]'}`}>
                      {t.subject}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {name} · {c?.company ?? ''}
                  </p>
                  <p className="text-sm text-slate-500 truncate mt-2 leading-relaxed">
                    {lastMessage?.content ?? 'Aucun message'}
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${statusStyles[t.status]}`}>
                      {statusLabels[t.status]}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${priorityStyles[t.priority]}`}>
                      {priorityLabels[t.priority]}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      {t.messages.length} message{t.messages.length > 1 ? 's' : ''} · maj{' '}
                      {new Date(t.updated_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>

                <ArrowUpRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-slate-500">Aucun ticket ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
