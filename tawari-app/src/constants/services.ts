import { colors } from './theme';
import type { IconName } from '../components/AppIcon';

export type SosKey = 'fire' | 'police' | 'amb';
export type OtherKey =
  | 'gas'
  | 'elec'
  | 'water'
  | 'traffic'
  | 'tourist'
  | 'health'
  | 'women';
export type ServiceKey = SosKey | OtherKey;

export interface SosService {
  key: SosKey;
  number: string;
  eta: string;
  icon: IconName;
  color: string;
  colorDark: string;
}

export interface OtherService {
  key: OtherKey;
  number: string;
  icon: IconName;
  // Distinct accent per category for the glass-badge glow treatment (matches
  // the curated palette used in the Figma "Midnight Glass" redesign).
  glowColor: string;
}

// Names and labels are NOT stored here — they're looked up via
// t(`services.${key}.name`) / t(`services.${key}.label`) so they stay in
// sync with the active language. Numbers, icons, and colors are locale-independent.
export const sosServices: Record<SosKey, SosService> = {
  fire: {
    key: 'fire',
    number: '180',
    eta: '6',
    icon: 'flame-outline',
    color: colors.fire,
    colorDark: colors.fireDark,
  },
  police: {
    key: 'police',
    number: '122',
    eta: '8',
    icon: 'shield-outline',
    color: colors.police,
    colorDark: colors.policeDark,
  },
  amb: {
    key: 'amb',
    number: '123',
    eta: '9',
    icon: 'medkit-outline',
    color: colors.amb,
    colorDark: colors.ambDark,
  },
};

export const otherServices: Record<OtherKey, OtherService> = {
  elec: { key: 'elec', number: '121', icon: 'flash-outline', glowColor: '#FBBF24' },
  gas: { key: 'gas', number: '129', icon: 'cloud-outline', glowColor: '#38BDF8' },
  traffic: { key: 'traffic', number: '128', icon: 'car-outline', glowColor: '#FB7185' },
  water: { key: 'water', number: '125', icon: 'water-outline', glowColor: '#22D3EE' },
  tourist: { key: 'tourist', number: '126', icon: 'business-outline', glowColor: '#A78BFA' },
  health: { key: 'health', number: '137', icon: 'medical-outline', glowColor: '#F472B6' },
  women: { key: 'women', number: '15115', icon: 'woman-outline', glowColor: '#FB923C' },
};

export function findService(key: ServiceKey): SosService | OtherService {
  return (sosServices as Record<string, SosService | OtherService>)[key] ?? otherServices[key as OtherKey];
}
