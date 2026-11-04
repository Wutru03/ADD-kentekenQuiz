import { useMutation } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { insertRound, type Round } from '@/services/rounds';

// mutate(round) saves one round; its data is the id of the new row.
export function useSaveRound() {
  const db = useSQLiteContext();
  return useMutation({ mutationFn: (round: Round) => insertRound(db, round) });
}
