import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { type Lead, type LeadStatus } from '../../types/lead';
import KanbanCard from './KanbanCard.tsx';

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, leads }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="board-column" style={{ borderTop: `4px solid var(--status-${status.toLowerCase()}-text)` }}>
      <div className="column-header">
        <div className="column-title">
          {status}
          <span className="column-count">{leads.length}</span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minHeight: 200,
          background: isOver ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
          borderRadius: 12,
          transition: 'background 0.2s',
          overflowY: 'auto',
          flex: 1,
          paddingBottom: 16
        }}
      >
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <KanbanCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', border: '2px dashed var(--border)', borderRadius: 12, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
