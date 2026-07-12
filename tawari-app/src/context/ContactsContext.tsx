import React, { createContext, useContext, useEffect, useState } from 'react';
import { readJSON, writeJSON, STORAGE_KEYS } from '../utils/storage';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export const MAX_CONTACTS = 5;

interface ContactsContextValue {
  contacts: EmergencyContact[];
  loaded: boolean;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<boolean>;
  updateContact: (id: string, patch: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
}

const ContactsContext = createContext<ContactsContextValue | null>(null);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    readJSON<EmergencyContact[]>(STORAGE_KEYS.contacts, []).then((data) => {
      setContacts(data);
      setLoaded(true);
    });
  }, []);

  const persist = async (next: EmergencyContact[]) => {
    setContacts(next);
    await writeJSON(STORAGE_KEYS.contacts, next);
  };

  const addContact: ContactsContextValue['addContact'] = async (contact) => {
    if (contacts.length >= MAX_CONTACTS) return false;
    const next = [...contacts, { ...contact, id: Date.now().toString(36) }];
    await persist(next);
    return true;
  };

  const updateContact: ContactsContextValue['updateContact'] = async (id, patch) => {
    const next = contacts.map((c) => (c.id === id ? { ...c, ...patch } : c));
    await persist(next);
  };

  const removeContact = async (id: string) => {
    const next = contacts.filter((c) => c.id !== id);
    await persist(next);
  };

  return (
    <ContactsContext.Provider value={{ contacts, loaded, addContact, updateContact, removeContact }}>
      {children}
    </ContactsContext.Provider>
  );
}

export function useContacts() {
  const ctx = useContext(ContactsContext);
  if (!ctx) throw new Error('useContacts must be used within ContactsProvider');
  return ctx;
}
