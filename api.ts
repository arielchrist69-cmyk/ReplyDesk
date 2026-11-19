import { supabase } from './supabase';
import type { Customer, Ticket, TicketMessage, TicketPriority, TicketStatus } from '../types';

export interface TicketWithDetails extends Ticket {
  customer: Customer | null;
  messages: TicketMessage[];
}

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Customer[];
}

export async function insertCustomer(input: {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
}): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Customer;
}

export async function fetchTickets(): Promise<TicketWithDetails[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select(
      `*,
       customer:customers(id, user_id, name, company, email, phone, city, status, created_at),
       ticket_messages(id, ticket_id, author, role, content, created_at)`
    )
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((t: any): TicketWithDetails => ({
    ...t,
    customer: t.customer ?? null,
    messages: (t.ticket_messages ?? []).sort((a: TicketMessage, b: TicketMessage) =>
      a.created_at.localeCompare(b.created_at)
    ),
  }));
}

export async function insertTicket(input: {
  customer_id: string;
  subject: string;
  priority: TicketPriority;
  status?: TicketStatus;
  firstMessage: string;
  author: string;
}): Promise<Ticket> {
  const { firstMessage, author, ...ticketInput } = input;
  const { data, error } = await supabase
    .from('tickets')
    .insert(ticketInput)
    .select()
    .single();
  if (error) throw error;
  const ticket = data as Ticket;
  if (firstMessage.trim()) {
    const { error: msgError } = await supabase.from('ticket_messages').insert({
      ticket_id: ticket.id,
      author,
      role: 'client',
      content: firstMessage.trim(),
    });
    if (msgError) throw msgError;
  }
  return ticket;
}

export async function insertTicketMessage(input: {
  ticket_id: string;
  author: string;
  role: 'client' | 'agent';
  content: string;
}): Promise<TicketMessage> {
  const { data, error } = await supabase
    .from('ticket_messages')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  await supabase
    .from('tickets')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', input.ticket_id);
  return data as TicketMessage;
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<void> {
  const { error } = await supabase
    .from('tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId);
  if (error) throw error;
}

export async function fetchProfile(userId: string, email: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (data) return data as { id: string; email: string; full_name: string; company: string };
  const fallback = { id: userId, email, full_name: '', company: '' };
  const { error } = await supabase
    .from('profiles')
    .upsert({ ...fallback, full_name: email.split('@')[0] });
  if (error) return fallback;
  return { ...fallback, full_name: email.split('@')[0] };
}

export async function updateProfile(
  userId: string,
  updates: { full_name?: string; company?: string }
): Promise<void> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) throw error;
}
