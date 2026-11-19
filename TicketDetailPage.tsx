import { useState } from 'react';
import { ArrowLeft, Send, Clock, UserRound, AlertCircle } from 'lucide-react';
import type { Customer, TicketStatus } from '../types';
import type { TicketWithDetails } from '../lib/api';
import { insertTicketMessage, updateTicketStatus } from '../lib/api';
import { statusLabels, statusStyles, priorityLabels, priorityStyles, initials, avatarColor } from '../utils';

interface Props {
  ticket: TicketWithDetails;
  onBack: () => void;
  onTicketUpdated: () => void;
}

const nextStatus: Record<TicketStatus, TicketStatus[]> = {
  ouvert: ['en_cours', 'en_attente', 'resolu'],
  en_cours: ['ouvert', 'en_attente', 'resolu'],
  en_attente: ['ouvert', 'en_cours', 'resolu'],
  resolu: ['ouvert', 'en_cours', 'en_attente'],
};

export default function TicketDetailPage({ ticket, onBack, onTicketUpdated }: Props) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const customer = ticket.customer;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setError('');
    setSending(true);
    try {
      await insertTicketMessage({
        ticket_id: ticket.id,
        author: 'Vous',
        role: 'agent',
        content: reply.trim(),
      });
      setReply('');
      onTicketUpdated();
    } catch {
      setError("Impossible d'envoyer la réponse. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  const setStatus = async (s: TicketStatus) => {
    setError('');
    try {
      await updateTicketStatus(ticket.id, s);
      onTicketUpdated();
    } catch {
      setError('Impossible de changer le statut. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <header className="mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#2E6BFF] transition mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Retour à la boîte de réception
        </button>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#0B1B33] tracking-tight">{ticket.subject}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${statusStyles[ticket.status]}`}>
                {statusLabels[ticket.status]}
              </span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${priorityStyles[ticket.priority]}`}>
                Priorité {priorityLabels[ticket.priority].toLowerCase()}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1.5">
              Ouvert le{' '}
              {new Date(ticket.created_at).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })} ·
              dernière activité{' '}
              {new Date(ticket.updated_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {nextStatus[ticket.status].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  s === 'resolu'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-[#2E6BFF] hover:text-[#2E6BFF]'
                }`}
              >
                Marquer « {statusLabels[s].toLowerCase()} »
              </button>
            ))}
          </div>
        </div>
      </header>

      {error && (
        <p className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-4">
          {ticket.messages.map((m) => {
            const isAgent = m.role === 'agent';
            return (
              <div key={m.id} className={`flex gap-4 ${isAgent ? 'flex-row-reverse' : ''}`}>
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isAgent ? 'bg-[#2E6BFF] text-white' : avatarColor(customer?.id ?? 'x')
                  }`}
                >
                  {isAgent ? <UserRound className="w-4 h-4" /> : initials(m.author || '?')}
                </span>
                <div className={`max-w-[85%] sm:max-w-[75%] ${isAgent ? 'text-right' : ''}`}>
                  <p
                    className="text-xs text-slate-400 mb-1.5 flex items-center gap-2"
                    style={{ justifyContent: isAgent ? 'flex-end' : 'flex-start' }}
                  >
                    <span className="font-semibold text-slate-600">{m.author || 'Anonyme'}</span>
                    · {new Date(m.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed text-left ${
                      isAgent
                        ? 'bg-[#2E6BFF] text-white rounded-tr-sm'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              </div>
            );
          })}
          {ticket.messages.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200/80">
              Aucun message dans ce ticket pour le moment.
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Client</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold ${avatarColor(customer?.id ?? 'x')}`}>
                {initials(customer?.name ?? '?')}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0B1B33] truncate">{customer?.name ?? '—'}</p>
                <p className="text-xs text-slate-500 truncate">{customer?.company ?? ''}</p>
              </div>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">E-mail</dt>
                <dd className="text-slate-700 font-medium truncate">{customer?.email || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Téléphone</dt>
                <dd className="text-slate-700 font-medium">{customer?.phone || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Ville</dt>
                <dd className="text-slate-700 font-medium">{customer?.city || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Client depuis</dt>
                <dd className="text-slate-700 font-medium">
                  {customer ? new Date(customer.created_at).toLocaleDateString('fr-FR') : '—'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Détails du ticket</h2>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  Statut
                </dt>
                <dd>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${statusStyles[ticket.status]}`}>
                    {statusLabels[ticket.status]}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-400">Priorité</dt>
                <dd className="text-slate-700 font-medium">{priorityLabels[ticket.priority]}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <form onSubmit={handleSend} className="mt-6 bg-white rounded-2xl border border-slate-200/80 p-5">
        <label className="block text-sm font-semibold text-[#0B1B33] mb-3">Votre réponse</label>
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          placeholder="Rédigez votre réponse au client…"
          className="w-full rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 p-4 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-slate-400">Votre réponse est enregistrée définitivement.</p>
          <button
            type="submit"
            disabled={!reply.trim() || sending}
            className="inline-flex items-center gap-2 bg-[#2E6BFF] hover:bg-[#1D4FD8] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Envoi…' : 'Envoyer la réponse'}
          </button>
        </div>
      </form>
    </div>
  );
}
