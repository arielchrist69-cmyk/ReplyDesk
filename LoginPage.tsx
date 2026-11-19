import { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

interface Props {
  onGoToSignup: () => void;
}

export default function LoginPage({ onGoToSignup }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-[#0B1B33] mb-2">Connexion</h1>
      <p className="text-sm text-slate-500 mb-8">
        Connectez-vous pour accéder à votre espace support.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0B1B33] mb-1.5">
            Adresse e-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2E6BFF]/30 focus:border-[#2E6BFF] transition"
            />
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
          {loading ? 'Connexion…' : 'Se connecter'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <p className="text-sm text-slate-500 text-center mt-8">
        Pas encore de compte ?{' '}
        <button
          onClick={onGoToSignup}
          className="font-semibold text-[#2E6BFF] hover:text-[#1D4FD8] transition"
        >
          Créer un compte
        </button>
      </p>
    </AuthLayout>
  );
}
