import { colors } from './theme';
import type { IconName } from '../components/AppIcon';

export type SosKey = 'fire' | 'police' | 'amb';
export type OtherKey =
  | 'gas'
  | 'elec'
  | 'water'
  | 'traffic'
  | 'tourist'
  | 'child'
  | 'health'
  | 'rail'
  | 'women'
  | 'addiction'
  | 'prosecution';
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
  gas: { key: 'gas', number: '129', icon: 'cloud-outline' },
  elec: { key: 'elec', number: '121', icon: 'flash-outline' },
  water: { key: 'water', number: '125', icon: 'water-outline' },
  traffic: { key: 'traffic', number: '128', icon: 'car-outline' },
  tourist: { key: 'tourist', number: '126', icon: 'business-outline' },
  child: { key: 'child', number: '16000', icon: 'happy-outline' },
  health: { key: 'health', number: '137', icon: 'medical-outline' },
  rail: { key: 'rail', number: '145', icon: 'train-outline' },
  women: { key: 'women', number: '15115', icon: 'woman-outline' },
  addiction: { key: 'addiction', number: '08008880700', icon: 'leaf-outline' },
  prosecution: { key: 'prosecution', number: '15888', icon: 'hammer-outline' },
};

export function findService(key: ServiceKey): SosService | OtherService {
  return (sosServices as Record<string, SosService | OtherService>)[key] ?? otherServices[key as OtherKey];
}
