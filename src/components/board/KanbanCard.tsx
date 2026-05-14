import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Lead } from '../../types/lead';
import { Mail, Phone, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { STATUS_COLORS } from '../../types/lead';

interface KanbanCardProps {
  lead: Lead;
  isOverlay?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ lead, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
  };

  const colors = STATUS_COLORS[lead.status];

  const content = (
    <div
      className={`kanban-card ${isOverlay ? 'dragging' : ''}`}
      style={{
        borderLeft: `4px solid var(--status-${lead.status.toLowerCase()}-text)`,
        opacity: isDragging ? 0.5 : 1
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
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
        <div style={{ overflow: 'hidden' }}>
          <h4 style={{ margin: 0, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.name}</h4>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.email}</div>
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>
            {lead.source || 'Website'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={12} />
            <span>{formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isOverlay) return content;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content}
    </div>
  );
};

export default KanbanCard;
