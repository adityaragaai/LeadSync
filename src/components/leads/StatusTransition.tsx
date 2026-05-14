import React from 'react';
import { type LeadStatus, VALID_TRANSITIONS } from '../../types/lead';
import { ChevronRight } from 'lucide-react';

interface StatusTransitionProps {
  currentStatus: LeadStatus;
  onTransition: (status: LeadStatus) => void;
  isLoading: boolean;
}

const StatusTransition: React.FC<StatusTransitionProps> = ({ currentStatus, onTransition, isLoading }) => {
  const possibleTransitions = VALID_TRANSITIONS[currentStatus] || [];

  if (possibleTransitions.length === 0) {
    return <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, fontStyle: 'italic' }}>This lead has reached a terminal state ({currentStatus}).</p>;
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {possibleTransitions.map((status) => (
        <button 
          key={status} 
          className="btn" 
          style={{ 
            background: 'white', 
            border: '1px solid #e2e8f0', 
            color: '#334155', 
            padding: '6px 12px',
            fontSize: '0.8125rem',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          onClick={() => onTransition(status)} 
          disabled={isLoading}
        >
          Move to {status} <ChevronRight size={14} style={{ color: '#94a3b8' }} />
        </button>
      ))}
    </div>
  );
};

export default StatusTransition;
