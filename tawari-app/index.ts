import { I18nManager } from 'react-native';

// التطبيق عربي بالكامل ومصمم يدويًا لعرض RTL (زي البروتوتايب HTML الأصلي بـ dir="rtl")،
// فبنقفل الـ auto-mirroring بتاع النظام عشان نضمن نفس الشكل على كل الأجهزة
// بدل ما نعتمد على لغة نظام تشغيل المستخدم أو نحتاج إعادة تشغيل بعد forceRTL.
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

// eslint-disable-next-line import/no-unassigned-import
import 'expo-router/entry';
