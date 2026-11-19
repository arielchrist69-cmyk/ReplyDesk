export type CustomerStatus = 'actif' | 'inactif';
export type TicketStatus = 'ouvert' | 'en_cours' | 'resolu' | 'en_attente';
export type TicketPriority = 'basse' | 'moyenne' | 'haute' | 'urgente';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  company: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  status: CustomerStatus;
  created_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  author: string;
  role: 'client' | 'agent';
  content: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  customer_id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export type View = 'dashboard' | 'customers' | 'tickets' | 'ticket-detail';
