import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLeads } from '../hooks/useLeads';
import { useLeadActions } from '../hooks/useLeadActions';
import { type LeadStatus, type Lead, VALID_TRANSITIONS } from '../types/lead';
import KanbanColumn from '../components/board/KanbanColumn';
import KanbanCard from '../components/board/KanbanCard.tsx';
import { Loader2, Search, Kanban } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

const BoardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: leads, isLoading } = useLeads();
  const { updateStatus } = useLeadActions();
  const [activeLead, setActiveLead] = useState<Lead | null>(null);

  const q = searchParams.get('q') || '';

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    if (!q) return leads;
    const lower = q.toLowerCase();
    return leads.filter(l => l.name.toLowerCase().includes(lower) || l.email.toLowerCase().includes(lower));
  }, [leads, q]);

  const columns = useMemo(() => {
    const cols: Record<LeadStatus, Lead[]> = { NEW: [], CONTACTED: [], QUALIFIED: [], CONVERTED: [], LOST: [] };
    filteredLeads.forEach(lead => { if (cols[lead.status]) cols[lead.status].push(lead); });
    return cols;
  }, [filteredLeads]);

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads?.find(l => l.id === event.active.id);
    if (lead) setActiveLead(lead);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !activeLead) { setActiveLead(null); return; }

    const activeId = active.id as string;
    const overId = over.id as string;

    const overStatus =
      STATUSES.find(s => s === overId) ||
      leads?.find(l => l.id === overId)?.status;

    if (overStatus && activeLead.status !== overStatus) {
      const possible = VALID_TRANSITIONS[activeLead.status];
      if (possible.includes(overStatus as LeadStatus)) {
        try { await updateStatus({ id: activeId, status: overStatus as LeadStatus }); }
        catch { /* handled by react-query */ }
      } else {
        toast.error(`Can't move from ${activeLead.status} → ${overStatus}`);
      }
    }

    setActiveLead(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v) searchParams.set('q', v); else searchParams.delete('q');
    setSearchParams(searchParams);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-slate-500 text-sm">Loading pipeline…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Board</h1>
          <p>Drag and drop leads between stages</p>
        </div>
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
        <button className="btn btn-ghost">
          Clear filters
        </button>
      </div>

      <div className="board-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="board-container" style={{ height: 'calc(100vh - 220px)' }}>
            {STATUSES.map((status) => (
              <KanbanColumn key={status} status={status} leads={columns[status]} />
            ))}
          </div>

          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: { active: { opacity: '0.3' } },
              }),
            }}
          >
            {activeLead ? <KanbanCard lead={activeLead} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default BoardPage;
