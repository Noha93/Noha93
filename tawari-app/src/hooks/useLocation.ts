import { useCallback, useRef, useState } from 'react';
import * as Location from 'expo-location';
import type { Coords } from '../utils/share';

export type LocationStatus = 'idle' | 'locating' | 'on' | 'off';

export function useLocation() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState<LocationStatus>('idle');
  const requesting = useRef(false);

  const requestLocation = useCallback(async () => {
    if (requesting.current) return;
    requesting.current = true;
    setStatus('locating');
    try {
      const { status: permission } = await Location.requestForegroundPermissionsAsync();
      if (permission !== 'granted') {
        setStatus('off');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      setStatus('on');
    } catch {
      setStatus('off');
    } finally {
      requesting.current = false;
    }
  }, []);

  return { coords, status, requestLocation };
}
