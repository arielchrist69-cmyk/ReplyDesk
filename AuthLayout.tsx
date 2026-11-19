import type { ReactNode } from 'react';
import { MessageSquareText, Check } from 'lucide-react';

interface Props {
  children: ReactNode;
}

const highlights = [
  'Centralisez toutes les demandes clients',
  'Répondez plus vite, sans rien oublier',
  'Suivez vos tickets en temps réel',
];

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-[#0B1B33] text-white p-8 lg:p-16 flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#2E6BFF] flex items-center justify-center">
            <MessageSquareText className="w-5 h-5" />
          </span>
          <span className="text-xl font-bold tracking-tight">ReplyDesk</span>
        </div>

        <div className="my-12 lg:my-0 max-w-md">
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-6">
            Le support client, enfin sous contrôle.
          </h1>
          <ul className="space-y-4">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-white/80">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-[#2E6BFF]/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#6C9BFF]" />
                </span>
                <span className="leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-white/50">
          Déjà adopté par plus de 1 200 indépendants et agences.
        </p>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
