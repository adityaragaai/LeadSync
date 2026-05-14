export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string;
  source?: string;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  source?: string;
}

export const VALID_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['CONTACTED', 'LOST'],
  CONTACTED: ['QUALIFIED', 'LOST'],
  QUALIFIED: ['CONVERTED', 'LOST'],
  CONVERTED: [],
  LOST: [],
};

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  NEW: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', dot: '#3b82f6' },
  CONTACTED: { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7', dot: '#a855f7' },
  QUALIFIED: { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', dot: '#eab308' },
  CONVERTED: { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', dot: '#22c55e' },
  LOST: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', dot: '#ef4444' },
};
