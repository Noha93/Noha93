export type AlertLevel = 'high' | 'medium' | 'low';

export interface AlertItem {
  id: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
  icon: string;
  level: AlertLevel;
  timeAr: string;
  timeEn: string;
}

export const alerts: AlertItem[] = [
  {
    id: 'a1', ar: 'موجة حر شديدة', en: 'Severe heat wave',
    descAr: 'درجات حرارة تصل إلى 42° في القاهرة الكبرى. تجنّب التعرض المباشر للشمس.',
    descEn: 'Temperatures reaching 42°C in Greater Cairo. Avoid direct sun exposure.',
    icon: 'thermometer-outline', level: 'high', timeAr: 'منذ ساعة', timeEn: '1 hour ago',
  },
  {
    id: 'a2', ar: 'أمطار غزيرة متوقعة', en: 'Heavy rain expected',
    descAr: 'احتمال سقوط أمطار رعدية على السواحل الشمالية مساء اليوم.',
    descEn: 'Thunderstorms possible along the north coast this evening.',
    icon: 'rainy-outline', level: 'medium', timeAr: 'منذ 3 ساعات', timeEn: '3 hours ago',
  },
  {
    id: 'a3', ar: 'غلق طريق', en: 'Road closure',
    descAr: 'غلق جزئي بمحور 26 يوليو لأعمال صيانة حتى منتصف الليل.',
    descEn: 'Partial closure on the 26th of July corridor for maintenance until midnight.',
    icon: 'construct-outline', level: 'low', timeAr: 'منذ 5 ساعات', timeEn: '5 hours ago',
  },
  {
    id: 'a4', ar: 'تنبيه حكومي', en: 'Government notice',
    descAr: 'أطلقت الحماية المدنية خط طوارئ إضافي خلال موجة الطقس الحالية.',
    descEn: 'Civil Protection has opened an extra emergency line during the current weather wave.',
    icon: 'megaphone-outline', level: 'medium', timeAr: 'أمس', timeEn: 'Yesterday',
  },
];
