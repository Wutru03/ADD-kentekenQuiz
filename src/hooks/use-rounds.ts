import { useQuery } from '@tanstack/react-query';
import { useSQLiteContext } from 'expo-sqlite';

import { listRounds } from '@/services/rounds';

// All rounds, newest first. History and Map share this key; save and delete invalidate it.
export function useRounds() {
  const db = useSQLiteContext();
  return useQuery({ queryKey: ['rounds'], queryFn: () => listRounds(db) });
}
