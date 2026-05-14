import React, { useState, useMemo, useEffect } from 'react';
import { useLeads } from '../hooks/useLeads';
import { useLeadActions } from '../hooks/useLeadActions';
import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import StatusTransition from '../components/leads/StatusTransition';
import { Plus, Loader2, XSquare } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { type Lead, type LeadStatus, VALID_TRANSITIONS } from '../types/lead';

const LeadsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: leads, isLoading, error } = useLeads();
  const { createLead, updateLead, deleteLead, updateStatus, isCreating, isUpdating, isUpdatingStatus } = useLeadActions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const editId = searchParams.get('edit');
  const viewId = searchParams.get('view');
  const isNew = searchParams.get('new') === 'true';

  useEffect(() => {
    if (editId && leads) {
      const lead = leads.find(l => l.id === editId);
      if (lead) { setSelectedLead(lead); setIsFormOpen(true); }
    } else if (viewId && leads) {
      const lead = leads.find(l => l.id === viewId);
      if (lead) { setSelectedLead(lead); setIsViewOpen(true); }
    } else if (isNew) {
      setSelectedLead(null); setIsFormOpen(true);
    } else {
      setIsFormOpen(false); setIsViewOpen(false);
    }
  }, [editId, viewId, isNew, leads]);

  const closeModals = () => {
    searchParams.delete('edit'); searchParams.delete('view'); searchParams.delete('new');
    setSearchParams(searchParams);
  };

  const q = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || '';

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter(lead => {
      const matchesQ = q ? (lead.name.toLowerCase().includes(q.toLowerCase()) || lead.email.toLowerCase().includes(q.toLowerCase())) : true;
      const matchesStatus = statusFilter ? lead.status === statusFilter : true;
      return matchesQ && matchesStatus;
    });
  }, [leads, q, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v) searchParams.set('q', v); else searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const handleStatusFilter = (status: string) => {
    if (status) searchParams.set('status', status); else searchParams.delete('status');
    setSearchParams(searchParams);
  };

  const onSubmitForm = async (data: any) => {
    if (selectedLead) await updateLead({ id: selectedLead.id, data });
    else await createLead(data);
    closeModals();
  };

  const handleDelete = async () => {
    if (selectedLead) { await deleteLead(selectedLead.id); setIsDeleteOpen(false); }
  };

  const handleTransition = async (status: LeadStatus) => {
    if (selectedLead) { await updateStatus({ id: selectedLead.id, status }); closeModals(); }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredLeads.map(l => l.id)));
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedIds(newSet);
  };

  const validBulkTransitions = useMemo(() => {
    const selected = leads?.filter(l => selectedIds.has(l.id)) || [];
    if (selected.length === 0) return [];
    let intersection: LeadStatus[] = [];
    selected.forEach((lead, i) => {
      const valid = VALID_TRANSITIONS[lead.status] || [];
      if (i === 0) intersection = [...valid];
      else intersection = intersection.filter(s => valid.includes(s));
    });
    return intersection;
  }, [leads, selectedIds]);

  if (error) return <div>Error loading leads</div>;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Leads</h1>
          <p>Manage and track your leads in one place</p>
        </div>
        <button className="btn btn-primary" onClick={() => { searchParams.set('new', 'true'); setSearchParams(searchParams); }}>
          <Plus size={18} /> Add Lead
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper" style={{ maxWidth: 400 }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Search leads by name or email..." 
            value={q} 
            onChange={handleSearch} 
          />
        </div>
        <select className="input" value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn btn-ghost" onClick={() => { searchParams.delete('q'); searchParams.delete('status'); setSearchParams(searchParams); }}>
          Clear filters
        </button>
      </div>

      <div style={{ marginBottom: 16, fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        {filteredLeads.length} leads found
      </div>

      {isLoading ? (
        <div style={{ padding: 40, textAlign: 'center' }}><Loader2 size={24} className="animate-spin" /> Loading...</div>
      ) : (
        <div className="table-container">
          <LeadTable
            leads={filteredLeads}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onEdit={(lead) => { searchParams.set('edit', lead.id); setSearchParams(searchParams); }}
            onDelete={(id) => { setSelectedLead(leads?.find(l => l.id === id) || null); setIsDeleteOpen(true); }}
            onView={(lead) => { searchParams.set('view', lead.id); setSearchParams(searchParams); }}
          />
        </div>
      )}

      {selectedIds.size > 0 && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: '#1e293b', color: 'white', border: '1px solid #334155', padding: '12px 24px', borderRadius: 100, display: 'flex', gap: 24, alignItems: 'center', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selectedIds.size} selected</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Change Status:</span>
            {['CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].map(status => (
              <button
                key={status}
                className={`btn ${validBulkTransitions.includes(status as LeadStatus) ? 'btn-ghost' : ''}`}
                style={{ 
                  color: validBulkTransitions.includes(status as LeadStatus) ? 'white' : '#64748b',
                  opacity: validBulkTransitions.includes(status as LeadStatus) ? 1 : 0.5,
                  cursor: validBulkTransitions.includes(status as LeadStatus) ? 'pointer' : 'not-allowed',
                  padding: '4px 12px',
                  background: 'rgba(255,255,255,0.1)'
                }}
                disabled={!validBulkTransitions.includes(status as LeadStatus)}
                onClick={async () => {
                  for (const id of Array.from(selectedIds)) await updateStatus({ id, status: status as LeadStatus });
                  setSelectedIds(new Set());
                }}
              >
                {status}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ padding: 4, color: '#94a3b8' }} onClick={() => setSelectedIds(new Set())}><XSquare size={20} /></button>
        </div>
      )}

      <Modal isOpen={isFormOpen} onClose={closeModals} title={selectedLead ? 'Edit Lead' : 'Create Lead'}>
        <LeadForm initialData={selectedLead} onSubmit={onSubmitForm} onCancel={closeModals} isSubmitting={isCreating || isUpdating} />
      </Modal>

      <Modal isOpen={isViewOpen} onClose={closeModals} title="Lead Details">
        {selectedLead && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ 
                background: 'var(--status-new-bg)', color: 'var(--status-new-text)', 
                width: 56, height: 56, borderRadius: '50%', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 700, fontSize: '1.25rem' 
              }}>
                {selectedLead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{selectedLead.name}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>{selectedLead.email}</p>
                {selectedLead.phone && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '4px 0 0 0' }}>{selectedLead.phone}</p>}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Current Status:</span>
              <Badge status={selectedLead.status} />
            </div>
            
            <div style={{ padding: 20, background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
               <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: 12 }}>Available Transitions</div>
               <StatusTransition currentStatus={selectedLead.status} onTransition={handleTransition} isLoading={isUpdatingStatus} />
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Lead">
        <div style={{ padding: '8px 0' }}>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            Are you sure you want to delete <strong>{selectedLead?.name}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
            <button className="btn btn-ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Delete Lead</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LeadsPage;
