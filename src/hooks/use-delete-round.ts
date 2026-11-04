import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { deleteRound } from '@/services/rounds';

// mutate(id) deletes one round. Its cached detail goes too: the next round can reuse the id.
export function useDeleteRound() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteRound(db, id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['round', id] });
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
    },
  });
}
