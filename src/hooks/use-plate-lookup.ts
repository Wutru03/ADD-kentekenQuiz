import { skipToken, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { type Coords, getCurrentCoords } from '@/services/location';
import { fetchVehicle } from '@/services/rdw';

// coords: undefined while the location is being looked up, null when it is unavailable.
export function usePlateLookup() {
  const [plate, setPlate] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coords | null | undefined>(undefined);

  const query = useQuery({
    queryKey: ['vehicle', plate],
    // skipToken: no request until a valid plate is submitted.
    queryFn: plate ? () => fetchVehicle(plate) : skipToken,
  });

  // Expects a plate that is already normalised and validated.
  function lookUp(newPlate: string) {
    setPlate(newPlate);
    setCoords(undefined);
    getCurrentCoords().then(setCoords);
  }

  return { plate, query, coords, lookUp };
}
