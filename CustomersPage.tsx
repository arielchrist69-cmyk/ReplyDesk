import { useState } from 'react';
import { Menu, Search, Plus, Mail, Phone, MapPin, X } from 'lucide-react';
import type { Customer } from '../types';
import { initials, avatarColor } from '../utils';
import { insertCustomer } from '../lib/api';

interface Props {
  customers: Customer[];
  onDataChanged: () => void;
  onOpenMobileMenu: () => void;
}

export default function CustomersPage({ customers, onDataChanged, onOpenMobileMenu }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'tous' | 'actif' | 'inactif'>('tous');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', city: '' });

  const filtered = customers.filter((c) => {
    const matchesQuery = `${c.name} ${c.company} ${c.email} ${c.city}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter = filter === 'tous' || c.status === filter;
    return matchesQuery && matchesFilter;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await insertCustomer(form);
      setShowForm(false);
      setForm({ name: '', company: '', email: '', phone: '', city: '' });
      onDataChanged();
    } catch (err: any) {
      setError("Impossible d'enregistrer le client. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#0B1B33] tracking-tight">Clients</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {customers.length} clients · {customers.filter((c) => c.status === 'actif').length} actifs
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-[#2E6BFF] hover:bg-[#1D4FD8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          Nouveau client
        </button>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un client, une entreprise, une ville…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition bg-white"
          />
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1 self-start sm:self-auto">
          {(['tous', 'actif', 'inactif'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === f ? 'bg-white text-[#0B1B33] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f === 'tous' ? 'Tous' : f === 'actif' ? 'Actifs' : 'Inactifs'}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[#0B1B33]">Ajouter un client</h2>
            <button
              onClick={() => setShowForm(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Fermer le formulaire"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(
              [
                ['name', 'Nom complet', 'Camille Moreau'],
                ['company', 'Entreprise', 'Atelier Moreau'],
                ['email', 'Adresse e-mail', 'camille@exemple.fr'],
                ['phone', 'Téléphone', '+33 6 12 34 56 78'],
                ['city', 'Ville', 'Lyon'],
              ] as const
            ).map(([field, label, placeholder]) => (
              <div key={field}>
                <label className="block text-sm font-medium text-[#0B1B33] mb-1.5">{label}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  required={field === 'name' || field === 'email'}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition"
                />
              </div>
            ))}
            {error && (
              <p className="sm:col-span-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}
            <div className="sm:col-span-2 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2E6BFF] hover:bg-[#1D4FD8] disabled:opacity-60 disabled:cursor-wait text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200"
              >
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-6 py-3.5 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <span>Client</span>
          <span>Contact</span>
          <span>Ville</span>
          <span className="text-right">Statut</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr] gap-3 md:gap-4 px-6 py-4 hover:bg-slate-50 transition items-center"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(c.id)}`}
                >
                  {initials(c.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0B1B33] truncate">{c.name}</p>
                  <p className="text-xs text-slate-500 truncate">{c.company}</p>
                </div>
              </div>
              <div className="text-sm text-slate-600 space-y-0.5">
                <p className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {c.phone || '—'}
                </p>
              </div>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {c.city || '—'}
              </p>
              <div className="md:text-right">
                <span
                  className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${
                    c.status === 'actif'
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                      : 'bg-slate-100 text-slate-600 ring-slate-200'
                  }`}
                >
                  {c.status === 'actif' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-slate-500">Aucun client ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
