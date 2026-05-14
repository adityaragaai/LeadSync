import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type Lead } from '../../types/lead';
import { Loader2 } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  source: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: Lead | null;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      source: initialData?.source || '',
    },
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gap: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, color: '#334155' }}>Full Name *</label>
          <input className="input" style={{ width: '100%' }} {...register('name')} placeholder="e.g. Jane Doe" />
          {errors.name && <p style={{ fontSize: '0.75rem', color: 'var(--status-lost-text)', marginTop: 6 }}>{errors.name.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, color: '#334155' }}>Email Address *</label>
          <input className="input" style={{ width: '100%' }} {...register('email')} placeholder="jane@example.com" />
          {errors.email && <p style={{ fontSize: '0.75rem', color: 'var(--status-lost-text)', marginTop: 6 }}>{errors.email.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, color: '#334155' }}>Phone Number</label>
          <input className="input" style={{ width: '100%' }} {...register('phone')} placeholder="+1 (555) 000-0000" />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, color: '#334155' }}>Source</label>
          <input className="input" style={{ width: '100%' }} {...register('source')} placeholder="Website, Referral, LinkedIn, etc." />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
        <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
        <button className="btn btn-primary" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? (
            <><Loader2 size={16} className="animate-spin" />{initialData ? 'Saving...' : 'Creating...'}</>
          ) : (
            initialData ? 'Save Changes' : 'Create Lead'
          )}
        </button>
      </div>
    </form>
  );
};

export default LeadForm;
