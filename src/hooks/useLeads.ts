import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { leadApi } from '../api/leadApi';

export const useLeads = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || undefined;
  const q = searchParams.get('q') || undefined;

  return useQuery({
    queryKey: ['leads', { status, q }],
    queryFn: async () => {
      const leads = await leadApi.getLeads({ status, q });
      return leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  });
};
