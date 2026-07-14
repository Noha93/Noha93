import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface NetworkContextValue {
  // true until the first real event arrives, so we never flash an incorrect
  // "offline" banner during startup — the SOS/call flow never depends on this.
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkContextValue>({ isOnline: true });

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // isInternetReachable can be null while it's still being determined —
      // fall back to isConnected so we don't show "offline" prematurely.
      const reachable = state.isInternetReachable ?? state.isConnected ?? true;
      setIsOnline(reachable);
    });
    return unsubscribe;
  }, []);

  return <NetworkContext.Provider value={{ isOnline }}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  return useContext(NetworkContext);
}
