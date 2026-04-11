import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { Colors } from '../../constants/colors';
import { BorderRadius, Shadow, Spacing } from '../../constants/spacing';

interface FAQ {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    questionAr: 'كيف أحجز موعداً مع طبيب؟',
    questionEn: 'How do I book an appointment?',
    answerAr: 'ابحث عن الطبيب المطلوب، اضغط على "احجز موعداً"، اختر التاريخ والوقت المناسب، ثم أدخل بياناتك وأكّد الحجز.',
    answerEn: 'Search for the doctor, tap "Book Appointment", choose your preferred date and time, then enter your details and confirm the booking.',
  },
  {
    id: '2',
    questionAr: 'هل يمكنني إلغاء الموعد؟',
    questionEn: 'Can I cancel my appointment?',
    answerAr: 'نعم، يمكنك إلغاء الموعد من قسم "مواعيدي" في الملف الشخصي، ويُفضّل الإلغاء قبل 24 ساعة على الأقل.',
    answerEn: 'Yes, you can cancel from "My Appointments" in your profile. We recommend canceling at least 24 hours in advance.',
  },
  {
    id: '3',
    questionAr: 'كيف أجد الأطباء القريبين مني؟',
    questionEn: 'How do I find nearby doctors?',
    answerAr: 'اضغط على قسم "قريب مني" في شريط التنقل السفلي، وسيُعرض لك الأطباء المتاحون في منطقتك.',
    answerEn: 'Tap "Nearby" in the bottom navigation bar to see available doctors in your area.',
  },
  {
    id: '4',
    questionAr: 'كيف أتواصل مع الطبيب مباشرة؟',
    questionEn: 'How do I contact a doctor directly?',
    answerAr: 'في صفحة تفاصيل الطبيب، ستجد أزرار الاتصال والواتساب للتواصل المباشر مع العيادة.',
    answerEn: 'On the doctor\'s detail page, you\'ll find call and WhatsApp buttons for direct contact with the clinic.',
  },
  {
    id: '5',
    questionAr: 'هل التطبيق مجاني؟',
    questionEn: 'Is the app free to use?',
    answerAr: 'نعم، التطبيق مجاني بالكامل للمرضى. يدفع الأطباء رسوم اشتراك للظهور في التطبيق وإدارة مواعيدهم.',
    answerEn: 'Yes, the app is completely free for patients. Doctors pay a subscription fee to appear in the app and manage their appointments.',
  },
  {
    id: '6',
    questionAr: 'كيف أُضيف تقييماً للطبيب؟',
    questionEn: 'How do I add a doctor review?',
    answerAr: 'افتح صفحة الطبيب، اضغط على تبويب "التقييمات"، واختر عدد النجوم وأكتب تعليقك.',
    answerEn: 'Open the doctor\'s page, tap the "Reviews" tab, choose your star rating and write your comment.',
  },
];

const CONTACTS = [
  { icon: 'call', label: 'ar', labelEn: 'Call Us', value: '+20-2-1234-5678', action: () => Linking.openURL('tel:+20212345678'), color: Colors.primary },
  { icon: 'logo-whatsapp', label: 'واتساب', labelEn: 'WhatsApp', value: '+20-10-1234-5678', action: () => Linking.openURL('whatsapp://send?phone=20101234567'), color: Colors.success },
  { icon: 'mail', label: 'البريد الإلكتروني', labelEn: 'Email', value: 'support@clinicdir.com', action: () => Linking.openURL('mailto:support@clinicdir.com'), color: Colors.info },
];

export default function HelpSupportScreen() {
  const { isRTL, language } = useLanguage();
  const navigation = useNavigation<any>();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isRTL ? 'المساعدة والدعم' : 'Help & Support'}</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name="help-buoy" size={36} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>{isRTL ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}</Text>
          <Text style={styles.heroSubtitle}>
            {isRTL ? 'تجد هنا أجوبة للأسئلة الشائعة وطرق التواصل مع فريق الدعم' : 'Find answers to common questions and ways to contact our support team'}
          </Text>
        </View>

        {/* Contact Options */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'تواصل معنا' : 'Contact Us'}
        </Text>
        <View style={styles.contactsGrid}>
          {CONTACTS.map((c, i) => (
            <TouchableOpacity key={i} style={styles.contactCard} onPress={c.action}>
              <View style={[styles.contactIcon, { backgroundColor: c.color + '20' }]}>
                <Ionicons name={c.icon as any} size={24} color={c.color} />
              </View>
              <Text style={styles.contactLabel}>
                {language === 'ar' ? c.label : c.labelEn}
              </Text>
              <Text style={styles.contactValue}>{c.value}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
          {isRTL ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
        </Text>
        {FAQS.map(faq => {
          const isOpen = expandedFaq === faq.id;
          return (
            <TouchableOpacity
              key={faq.id}
              style={[styles.faqCard, isOpen && styles.faqCardOpen]}
              onPress={() => setExpandedFaq(isOpen ? null : faq.id)}
              activeOpacity={0.85}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQ, isRTL && styles.rtlText, { flex: 1 }]}>
                  {language === 'ar' ? faq.questionAr : faq.questionEn}
                </Text>
                <Ionicons
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Colors.textMuted}
                />
              </View>
              {isOpen && (
                <Text style={[styles.faqA, isRTL && styles.rtlText]}>
                  {language === 'ar' ? faq.answerAr : faq.answerEn}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Live Chat CTA */}
        <TouchableOpacity style={styles.chatCta}>
          <LinearGradient colors={[Colors.secondary, Colors.secondaryDark]} style={styles.chatCtaGrad}>
            <Ionicons name="chatbubbles" size={22} color={Colors.textWhite} />
            <View style={styles.chatCtaText}>
              <Text style={styles.chatCtaTitle}>{isRTL ? 'محادثة فورية' : 'Live Chat'}</Text>
              <Text style={styles.chatCtaDesc}>{isRTL ? 'تحدث مع فريق الدعم الآن' : 'Chat with our support team now'}</Text>
            </View>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={Colors.textWhite} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: Spacing.xl,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textWhite },
  content: { padding: Spacing.xl },
  rtlText: { textAlign: 'right' },

  hero: { alignItems: 'center', marginBottom: 28 },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  heroTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },

  contactsGrid: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  contactCard: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600', marginBottom: 4 },
  contactValue: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },

  faqCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  faqCardOpen: { borderColor: Colors.primary },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  faqA: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginTop: 10 },

  chatCta: { marginTop: 24, borderRadius: BorderRadius.xl, overflow: 'hidden' },
  chatCtaGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
    borderRadius: BorderRadius.xl,
  },
  chatCtaText: { flex: 1 },
  chatCtaTitle: { fontSize: 16, fontWeight: '700', color: Colors.textWhite },
  chatCtaDesc: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
