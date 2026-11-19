import type { TicketPriority, TicketStatus } from './types';

export const statusLabels: Record<TicketStatus, string> = {
  ouvert: 'Ouvert',
  en_cours: 'En cours',
  resolu: 'Résolu',
  en_attente: 'En attente',
};

export const priorityLabels: Record<TicketPriority, string> = {
  basse: 'Basse',
  moyenne: 'Moyenne',
  haute: 'Haute',
  urgente: 'Urgente',
};

export const statusStyles: Record<TicketStatus, string> = {
  ouvert: 'bg-blue-50 text-blue-700 ring-blue-200',
  en_cours: 'bg-amber-50 text-amber-700 ring-amber-200',
  resolu: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  en_attente: 'bg-slate-100 text-slate-600 ring-slate-200',
};

export const priorityStyles: Record<TicketPriority, string> = {
  basse: 'bg-slate-50 text-slate-600 ring-slate-200',
  moyenne: 'bg-blue-50 text-blue-700 ring-blue-200',
  haute: 'bg-orange-50 text-orange-700 ring-orange-200',
  urgente: 'bg-red-50 text-red-700 ring-red-200',
};

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
];

export function avatarColor(id: string) {
  let sum = 0;
  for (const c of id) sum += c.charCodeAt(0);
  return avatarColors[sum % avatarColors.length];
}
