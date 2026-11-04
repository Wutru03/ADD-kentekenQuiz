import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorView } from '@/components/error-view';
import { PinCard } from '@/components/pin-card';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRounds } from '@/hooks/use-rounds';
import { useTheme } from '@/hooks/use-theme';
import { type MapRegion, type Pin, pinsOf, regionFor } from '@/lib/map';
import type { StoredRound } from '@/services/rounds';

type PinMapProps = { rounds: StoredRound[]; pins: Pin[]; region: MapRegion; focusId: number | null };

// Mounted only when there is at least one pin, so `initialRegion` is the fit on open.
function PinMap({ rounds, pins, region, focusId }: PinMapProps) {
  const scheme = useColorScheme();
  const mapRef = useRef<MapView>(null);
  const [ready, setReady] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Fit again when a round is saved or deleted (the tab stays mounted). `initialRegion` fitted the first set.
  const pinIds = pins.map((pin) => pin.id).join(',');
  const fittedIds = useRef(pinIds);
  useEffect(() => {
    if (!ready || fittedIds.current === pinIds) return;
    fittedIds.current = pinIds;
    mapRef.current?.animateToRegion(region);
  }, [ready, pinIds, region]);

  // Only the id is kept, so a deleted round has no card. Ids can be reused, so a missing one is cleared too.
  const selected = rounds.find((round) => round.id === selectedId && pins.some((pin) => pin.id === round.id));
  if (selectedId !== null && selected === undefined) setSelectedId(null);

  // History's "View on map" passes a round id: select it and zoom to its pin. The param is cleared afterwards,
  // so pressing the same button again changes it again.
  const [seenFocusId, setSeenFocusId] = useState<number | null>(null);
  if (focusId !== seenFocusId) {
    setSeenFocusId(focusId);
    if (focusId !== null) setSelectedId(focusId);
  }
  useEffect(() => {
    if (!ready || focusId === null) return;
    const pin = pins.find((candidate) => candidate.id === focusId);
    const target = pin === undefined ? null : regionFor([pin]);
    if (target !== null) mapRef.current?.animateToRegion(target);
    router.setParams({ roundId: undefined });
  }, [ready, focusId, pins]);

  return (
    <View style={styles.map}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        userInterfaceStyle={scheme === 'dark' ? 'dark' : 'light'}
        toolbarEnabled={false}
        onMapReady={() => setReady(true)}
        onPress={() => setSelectedId(null)}>
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={pin.coords}
            stopPropagation
            accessibilityLabel="Round location"
            onPress={() => setSelectedId(pin.id)}
          />
        ))}
      </MapView>
      {selected !== undefined && (
        <View style={styles.card}>
          <PinCard round={selected} />
        </View>
      )}
    </View>
  );
}

export default function MapScreen() {
  const theme = useTheme();
  const query = useRounds();
  const { roundId } = useLocalSearchParams<{ roundId?: string }>();
  const focusId = roundId === undefined || Number.isNaN(Number(roundId)) ? null : Number(roundId);

  function renderBody() {
    if (query.isPending) return <ActivityIndicator color={theme.text} />;
    if (query.isError) return <ErrorView message={query.error.message} onRetry={() => query.refetch()} />;

    const pins = pinsOf(query.data);
    const region = regionFor(pins);
    if (region === null) {
      return <Text style={{ color: theme.text }}>No rounds with a location yet.</Text>;
    }
    return <PinMap rounds={query.data} pins={pins} region={region} focusId={focusId} />;
  }

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Map</Text>
      {renderBody()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: Spacing.two },
  title: { fontSize: 28, fontWeight: 'bold', paddingVertical: Spacing.two, paddingHorizontal: Spacing.three },
  map: { flex: 1 },
  card: { position: 'absolute', left: Spacing.three, right: Spacing.three, bottom: Spacing.three },
});
