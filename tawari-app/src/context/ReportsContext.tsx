import React, { createContext, useContext, useEffect, useState } from 'react';
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage';
import type { ServiceKey } from '../constants/services';
import type { Coords } from '../utils/share';

export interface ReportEntry {
  id: string;
  serviceKey: ServiceKey;
  serviceName: string;
  kind: 'report' | 'call';
  coords: Coords | null;
  createdAt: string;
  resolved: boolean | null;
}

interface ReportsContextValue {
  reports: ReportEntry[];
  loaded: boolean;
  addReport: (entry: Omit<ReportEntry, 'id' | 'createdAt'>) => Promise<ReportEntry>;
  setResolved: (id: string, resolved: boolean) => Promise<void>;
}

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    readJSON<ReportEntry[]>(STORAGE_KEYS.reports, []).then((data) => {
      setReports(data);
      setLoaded(true);
    });
  }, []);

  const persist = async (next: ReportEntry[]) => {
    setReports(next);
    await writeJSON(STORAGE_KEYS.reports, next);
  };

  const addReport: ReportsContextValue['addReport'] = async (entry) => {
    const full: ReportEntry = {
      ...entry,
      id: 'EG-' + Math.floor(10000 + Math.random() * 89999),
      createdAt: new Date().toISOString(),
    };
    await persist([full, ...reports]);
    return full;
  };

  const setResolved = async (id: string, resolved: boolean) => {
    const next = reports.map((r) => (r.id === id ? { ...r, resolved } : r));
    await persist(next);
  };

  return (
    <ReportsContext.Provider value={{ reports, loaded, addReport, setResolved }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}
