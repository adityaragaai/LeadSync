import axios from 'axios';
import { type Lead, type CreateLeadInput, type UpdateLeadInput, type LeadStatus } from '../types/lead';

const API_BASE_URL = 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leadApi = {
  getLeads: async (params?: { status?: string; q?: string }) => {
    const response = await api.get<Lead[]>('/leads', { params });
    return response.data;
  },

  getLead: async (id: string) => {
    const response = await api.get<Lead>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (lead: CreateLeadInput) => {
    const response = await api.post<Lead>('/leads', lead);
    return response.data;
  },

  updateLead: async (id: string, lead: UpdateLeadInput) => {
    const response = await api.put<Lead>(`/leads/${id}`, lead);
    return response.data;
  },

  deleteLead: async (id: string) => {
    await api.delete(`/leads/${id}`);
  },

  updateStatus: async (id: string, status: LeadStatus) => {
    const response = await api.patch<Lead>(`/leads/${id}/status`, { status });
    return response.data;
  },

  bulkCreate: async (leads: CreateLeadInput[]) => {
    const response = await api.post('/leads/bulk', { leads });
    return response.data;
  },

  bulkUpdate: async (leads: { id: string; status?: LeadStatus }[]) => {
    const response = await api.put('/leads/bulk', { leads });
    return response.data;
  },
};
