import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { getRound } from '@/services/rounds';

// data is null when there is no round with this id.
export function useRound(id: number) {
  const db = useSQLiteContext();
  return useQuery({ queryKey: ['round', id], queryFn: () => getRound(db, id) });
}
