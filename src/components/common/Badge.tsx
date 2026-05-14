import React from 'react';
import { type LeadStatus } from '../../types/lead';

interface BadgeProps {
  status: LeadStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const className = `badge badge-${status.toLowerCase()}`;
  return <span className={className}>{status}</span>;
};

export default Badge;
