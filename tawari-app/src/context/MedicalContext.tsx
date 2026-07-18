import React, { createContext, useContext, useEffect, useState } from 'react';
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage';

export interface MedicalProfile {
  name: string;
  age: string;
  blood: string;
  height: string;
  weight: string;
  allergies: string;
  diseases: string;
  meds: string;
  doctor: string;
  insurance: string;
  notes: string;
  photo: string;
}

const EMPTY_PROFILE: MedicalProfile = {
  name: '',
  age: '',
  blood: '',
  height: '',
  weight: '',
  allergies: '',
  diseases: '',
  meds: '',
  doctor: '',
  insurance: '',
  notes: '',
  photo: '',
};

interface MedicalContextValue {
  profile: MedicalProfile;
  loaded: boolean;
  hasData: boolean;
  updateProfile: (patch: MedicalProfile) => Promise<void>;
}

const MedicalContext = createContext<MedicalContextValue | null>(null);

export function MedicalProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<MedicalProfile>(EMPTY_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    readJSON<MedicalProfile>(STORAGE_KEYS.medical, EMPTY_PROFILE).then((data) => {
      setProfile({ ...EMPTY_PROFILE, ...data });
      setLoaded(true);
    });
  }, []);

  const updateProfile = async (patch: MedicalProfile) => {
    setProfile(patch);
    await writeJSON(STORAGE_KEYS.medical, patch);
  };

  const hasData = !!(profile.blood || profile.allergies || profile.diseases);

  return (
    <MedicalContext.Provider value={{ profile, loaded, hasData, updateProfile }}>
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedical() {
  const ctx = useContext(MedicalContext);
  if (!ctx) throw new Error('useMedical must be used within MedicalProvider');
  return ctx;
}
