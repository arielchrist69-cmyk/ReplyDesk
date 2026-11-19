import { useState } from 'react';
import { Mail, Lock, User, Building2, ArrowRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

interface Props {
  onGoToLogin: () => void;
}

export default function SignupPage({ onGoToLogin }: Props) {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordsMatch = form.confirm.length > 0 && form.password === form.confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas. Veuillez réessayer.');
      return;
    }
    setError('');
    setLoading(true);
    const err = await signUp(form.email, form.password, form.name, form.company);
    setLoading(false);
    if (err) setError(err);
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
    setError('');
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-[#0B1B33] mb-2">Créer un compte</h1>
      <p className="text-sm text-slate-500 mb-8">
        Quelques secondes suffisent pour démarrer votre essai gratuit.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0B1B33] mb-1.5">Nom complet</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={form.name}
              onChange={update('name')}
              placeholder="Marie Dupont"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1B33] mb-1.5">Entreprise</label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={form.company}
              onChange={update('company')}
              placeholder="Votre agence"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1B33] mb-1.5">
            Adresse e-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={form.email}
              onChange={update('email')}
              placeholder="vous@exemple.fr"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1B33] mb-1.5">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update('password')}
              placeholder="6 caractères minimum"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1B33] mb-1.5">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              required
              value={form.confirm}
              onChange={update('confirm')}
              placeholder="••••••••"
              className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 transition ${
                form.confirm.length === 0 || passwordsMatch
                  ? 'border-slate-200 focus:border-[#2E6BFF]'
                  : 'border-red-300 focus:border-red-400 focus:ring-red-200'
              }`}
            />
            {form.confirm.length > 0 && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {passwordsMatch ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </span>
            )}
          </div>
        </div>

        {error && (
          <p className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2E6BFF] hover:bg-[#1D4FD8] disabled:opacity-60 disabled:cursor-wait text-white font-semibold py-3 rounded-xl text-sm transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20"
        >
          {loading ? 'Création en cours…' : 'Créer mon compte'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-8">
        Vous avez déjà un compte ?{' '}
        <button
          onClick={onGoToLogin}
          className="font-semibold text-[#2E6BFF] hover:text-[#1D4FD8] transition"
        >
          Se connecter
        </button>
      </p>
    </AuthLayout>
  );
}
