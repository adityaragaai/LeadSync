import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { type Lead } from '../../types/lead';
import Badge from '../common/Badge';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LeadTableProps {
  leads: Lead[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onView: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({
  leads, selectedIds, onToggleSelect, onToggleSelectAll, onEdit, onDelete, onView,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: leads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const allSelected = leads.length > 0 && selectedIds.size === leads.length;

  const gridTemplateColumns = "48px 1.5fr 1.5fr 120px 120px 160px 120px";

  return (
    <div className="table-container" style={{ border: 'none', background: 'transparent' }}>
      {/* Header */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns, 
          padding: '16px 24px', 
          background: '#f8fafc', 
          borderBottom: '1px solid #f1f5f9',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-muted)'
        }}
      >
        <div><input type="checkbox" checked={allSelected} onChange={onToggleSelectAll} /></div>
        <div>Name</div>
        <div>Email</div>
        <div>Status</div>
        <div>Source</div>
        <div>Last Updated</div>
        <div style={{ textAlign: 'right' }}>Actions</div>
      </div>
      
      <div ref={parentRef} style={{ height: '600px', overflow: 'auto', position: 'relative' }}>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const lead = leads[virtualRow.index];
            return (
              <div
                key={lead.id}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  display: 'grid',
                  gridTemplateColumns,
                  alignItems: 'center',
                  padding: '0 24px',
                  borderBottom: '1px solid #f1f5f9',
                  background: virtualRow.index % 2 === 0 ? 'white' : '#f8fafc',
                  fontSize: '0.875rem'
                }}
              >
                <div>
                  <input type="checkbox" checked={selectedIds.has(lead.id)} onChange={() => onToggleSelect(lead.id)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
                  <div style={{ 
                    background: 'var(--status-new-bg)', 
                    color: 'var(--status-new-text)', 
                    width: 32, height: 32, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 600, 
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}>
                    {lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.name}</div>
                </div>
                <div style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.email}</div>
                <div><Badge status={lead.status} /></div>
                <div style={{ color: '#64748b' }}>{lead.source || 'Website'}</div>
                <div style={{ color: 'var(--text-muted)' }}>{formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => onView(lead)}><Eye size={16} /></button>
                  <button className="btn btn-ghost" style={{ padding: 6 }} onClick={() => onEdit(lead)}><Edit2 size={16} /></button>
                  <button className="btn btn-ghost text-danger" style={{ padding: 6 }} onClick={() => onDelete(lead.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
        {leads.length === 0 && (
          <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)', background: 'white', borderBottomLeftRadius: 'var(--radius-xl)', borderBottomRightRadius: 'var(--radius-xl)' }}>
            No leads found.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTable;
