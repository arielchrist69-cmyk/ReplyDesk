import { useCallback, useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import TicketsPage from './pages/TicketsPage';
import TicketDetailPage from './pages/TicketDetailPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchCustomers, fetchTickets, type TicketWithDetails } from './lib/api';
import type { Customer, View } from './types';

function AppInner() {
  const { user, loading, signOut } = useAuth();
  const [view, setView] = useState<View>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedTicket, setSelectedTicket] = useState<TicketWithDetails | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    setDataError('');
    try {
      const [c, t] = await Promise.all([fetchCustomers(), fetchTickets()]);
      setCustomers(c);
      setTickets(t);
    } catch {
      setDataError("Impossible de charger vos données. Vérifiez votre connexion puis réessayez.");
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Chargement…</p>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginPage onGoToSignup={() => setAuthMode('signup')} />
    ) : (
      <SignupPage onGoToLogin={() => setAuthMode('login')} />
    );
  }

  const openTickets = tickets.filter((t) => t.status === 'ouvert').length;

  const navigate = (v: View) => {
    setView(v);
    setSelectedTicket(null);
    setMobileMenuOpen(false);
  };

  const openTicket = (t: TicketWithDetails) => {
    setSelectedTicket(t);
    setView('ticket-detail');
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setView('dashboard');
    setSelectedTicket(null);
    setCustomers([]);
    setTickets([]);
  };

  const sidebarUser = {
    name: user.fullName || (user.email ?? '').split('@')[0],
    email: user.email ?? '',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        view={view}
        onNavigate={navigate}
        onLogout={handleLogout}
        openTickets={openTickets}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        user={sidebarUser}
      />
      <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-8 max-w-[1400px] mx-auto">
        {dataError && (
          <div className="mb-6 flex items-center justify-between gap-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            <span>{dataError}</span>
            <button
              onClick={loadData}
              className="shrink-0 font-semibold underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}
        {dataLoading && !dataError ? (
          <div className="py-24 text-center">
            <p className="text-sm text-slate-500">Chargement de vos données…</p>
          </div>
        ) : (
          <>
            {view === 'dashboard' && (
              <DashboardPage
                tickets={tickets}
                customersCount={customers.length}
                activeCustomersCount={customers.filter((c) => c.status === 'actif').length}
                onNavigate={navigate}
                onOpenTicket={openTicket}
                onOpenMobileMenu={() => setMobileMenuOpen(true)}
              />
            )}
            {view === 'customers' && (
              <CustomersPage
                customers={customers}
                onDataChanged={loadData}
                onOpenMobileMenu={() => setMobileMenuOpen(true)}
              />
            )}
            {view === 'tickets' && (
              <TicketsPage
                tickets={tickets}
                onNavigate={navigate}
                onOpenTicket={openTicket}
                onOpenMobileMenu={() => setMobileMenuOpen(true)}
              />
            )}
            {view === 'ticket-detail' && selectedTicket && (
              <TicketDetailPage
                ticket={selectedTicket}
                onBack={() => navigate('tickets')}
                onTicketUpdated={loadData}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
