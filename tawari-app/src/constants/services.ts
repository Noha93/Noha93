import { colors } from './theme';

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
  icon: string;
  color: string;
  colorDark: string;
}

export interface OtherService {
  key: OtherKey;
  name: string;
  number: string;
  label: string;
  icon: string;
}

// أرقام الطوارئ المصرية الرسمية
export const sosServices: Record<SosKey, SosService> = {
  fire: {
    key: 'fire',
    name: 'حريق',
    number: '180',
    label: 'الحماية المدنية / المطافي',
    eta: '6',
    icon: '🔥',
    color: colors.fire,
    colorDark: colors.fireDark,
  },
  police: {
    key: 'police',
    name: 'شرطة',
    number: '122',
    label: 'شرطة النجدة',
    eta: '8',
    icon: '👮',
    color: colors.police,
    colorDark: colors.policeDark,
  },
  amb: {
    key: 'amb',
    name: 'إسعاف',
    number: '123',
    label: 'الإسعاف المصري',
    eta: '9',
    icon: '🚑',
    color: colors.amb,
    colorDark: colors.ambDark,
  },
};

export const otherServices: Record<OtherKey, OtherService> = {
  gas: { key: 'gas', name: 'تسرب غاز', number: '129', label: 'شركة الغاز الطبيعي', icon: '🧯' },
  elec: { key: 'elec', name: 'أعطال كهرباء', number: '121', label: 'شركة الكهرباء', icon: '⚡' },
  water: { key: 'water', name: 'أعطال مياه', number: '125', label: 'شركة المياه', icon: '🚰' },
  traffic: { key: 'traffic', name: 'حوادث طرق / مرور', number: '128', label: 'شرطة المرور', icon: '🚗' },
  tourist: { key: 'tourist', name: 'الشرطة السياحية', number: '126', label: 'الشرطة السياحية والآثار', icon: '🕌' },
  child: { key: 'child', name: 'خط نجدة الطفل', number: '16000', label: 'المجلس القومي للطفولة والأمومة', icon: '🧒' },
  health: { key: 'health', name: 'طوارئ وزارة الصحة', number: '137', label: 'وزارة الصحة والسكان', icon: '🏥' },
  rail: { key: 'rail', name: 'شرطة السكة الحديد', number: '145', label: 'شرطة السكة الحديد', icon: '🚆' },
  women: { key: 'women', name: 'خط نجدة المرأة', number: '15115', label: 'المجلس القومي للمرأة', icon: '🆘' },
  addiction: { key: 'addiction', name: 'مكافحة الإدمان', number: '08008880700', label: 'صندوق مكافحة وعلاج الإدمان', icon: '💊' },
  prosecution: { key: 'prosecution', name: 'بلاغ للنيابة العامة', number: '15888', label: 'النيابة العامة', icon: '⚖️' },
};

export function findService(key: ServiceKey): SosService | OtherService {
  return (sosServices as Record<string, SosService | OtherService>)[key] ?? otherServices[key as OtherKey];
}
