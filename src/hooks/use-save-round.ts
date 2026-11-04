import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { insertRound, type Round } from '@/services/rounds';

// mutate(round) saves one round; its data is the id of the new row.
export function useSaveRound() {
  const db = useSQLiteContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (round: Round) => insertRound(db, round),
    // Not returned, so the jump to the result does not wait for the History refetch.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
    },
  });
}
