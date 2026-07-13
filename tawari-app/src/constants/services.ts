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
  name: string;
  number: string;
  label: string;
  eta: string;
  icon: IconName;
  color: string;
  colorDark: string;
}

export interface OtherService {
  key: OtherKey;
  name: string;
  number: string;
  label: string;
  icon: IconName;
}

// أرقام الطوارئ المصرية الرسمية
export const sosServices: Record<SosKey, SosService> = {
  fire: {
    key: 'fire',
    name: 'حريق',
    number: '180',
    label: 'الحماية المدنية / المطافي',
    eta: '6',
    icon: 'fire',
    color: colors.fire,
    colorDark: colors.fireDark,
  },
  police: {
    key: 'police',
    name: 'شرطة',
    number: '122',
    label: 'شرطة النجدة',
    eta: '8',
    icon: 'shield-account',
    color: colors.police,
    colorDark: colors.policeDark,
  },
  amb: {
    key: 'amb',
    name: 'إسعاف',
    number: '123',
    label: 'الإسعاف المصري',
    eta: '9',
    icon: 'ambulance',
    color: colors.amb,
    colorDark: colors.ambDark,
  },
};

export const otherServices: Record<OtherKey, OtherService> = {
  gas: { key: 'gas', name: 'تسرب غاز', number: '129', label: 'شركة الغاز الطبيعي', icon: 'gas-cylinder' },
  elec: { key: 'elec', name: 'أعطال كهرباء', number: '121', label: 'شركة الكهرباء', icon: 'flash' },
  water: { key: 'water', name: 'أعطال مياه', number: '125', label: 'شركة المياه', icon: 'water-pump' },
  traffic: { key: 'traffic', name: 'حوادث طرق / مرور', number: '128', label: 'شرطة المرور', icon: 'car-emergency' },
  tourist: { key: 'tourist', name: 'الشرطة السياحية', number: '126', label: 'الشرطة السياحية والآثار', icon: 'mosque' },
  child: { key: 'child', name: 'خط نجدة الطفل', number: '16000', label: 'المجلس القومي للطفولة والأمومة', icon: 'account-child' },
  health: { key: 'health', name: 'طوارئ وزارة الصحة', number: '137', label: 'وزارة الصحة والسكان', icon: 'hospital-box' },
  rail: { key: 'rail', name: 'شرطة السكة الحديد', number: '145', label: 'شرطة السكة الحديد', icon: 'train' },
  women: { key: 'women', name: 'خط نجدة المرأة', number: '15115', label: 'المجلس القومي للمرأة', icon: 'human-female' },
  addiction: { key: 'addiction', name: 'مكافحة الإدمان', number: '08008880700', label: 'صندوق مكافحة وعلاج الإدمان', icon: 'pill' },
  prosecution: { key: 'prosecution', name: 'بلاغ للنيابة العامة', number: '15888', label: 'النيابة العامة', icon: 'gavel' },
};

export function findService(key: ServiceKey): SosService | OtherService {
  return (sosServices as Record<string, SosService | OtherService>)[key] ?? otherServices[key as OtherKey];
}
