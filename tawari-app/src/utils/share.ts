import { Linking, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as SMS from 'expo-sms';
import type { Locale } from '../i18n/strings';

export interface Coords {
  lat: number;
  lng: number;
}

export function mapsLink(coords: Coords): string {
  return `https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
}

function formatTimestamp(date: Date, locale: Locale): string {
  return date.toLocaleString(locale === 'en' ? 'en-US' : 'ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Message text sent to a real contact via WhatsApp/SMS — kept as plain
// strings (not app-UI icons) since it has to render in a third-party app.
const MESSAGE_TEMPLATE: Record<Locale, { header: string; body: string; context: string; locationIntro: string; locationUnavailable: string; footer: string }> = {
  ar: {
    header: '🚨 حالة طوارئ',
    body: 'محتاج مساعدة.',
    context: '(بعد الاتصال بـ {{label}})',
    locationIntro: 'ده مكاني دلوقتي:',
    locationUnavailable: 'المكان مش متاح دلوقتي',
    footer: 'من فضلك تواصل معايا أو ابعتلي مساعدة.',
  },
  en: {
    header: '🚨 Emergency',
    body: 'I need help.',
    context: '(after calling {{label}})',
    locationIntro: 'This is my current location:',
    locationUnavailable: "Location isn't available right now",
    footer: 'Please contact me or send help.',
  },
};

export function emergencyMessage(coords: Coords | null, contextLabel?: string, locale: Locale = 'ar'): string {
  const t = MESSAGE_TEMPLATE[locale];
  const lines = [t.header, t.body];
  if (contextLabel) lines.push(t.context.replace('{{label}}', contextLabel));
  lines.push(t.locationIntro);
  lines.push(coords ? mapsLink(coords) : t.locationUnavailable);
  lines.push(t.footer);
  lines.push(`🕓 ${formatTimestamp(new Date(), locale)}`);
  return lines.join('\n');
}

export async function shareViaWhatsApp(message: string, phone?: string): Promise<boolean> {
  const base = phone ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/';
  const url = `${base}?text=${encodeURIComponent(message)}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) return false;
  await Linking.openURL(url);
  return true;
}

export async function shareViaSms(message: string, recipients: string[] = []): Promise<'sent' | 'unsupported' | 'fallback'> {
  const available = await SMS.isAvailableAsync();
  if (available) {
    const { result } = await SMS.sendSMSAsync(recipients, message);
    return result === 'sent' || result === 'unknown' ? 'sent' : 'fallback';
  }
  const url = `sms:${recipients.join(',')}?body=${encodeURIComponent(message)}`;
  const supported = await Linking.canOpenURL(url);
  if (!supported) return 'unsupported';
  await Linking.openURL(url);
  return 'fallback';
}

export async function shareViaSheet(message: string): Promise<void> {
  await Share.share({ message });
}

export async function copyLocationLink(coords: Coords | null): Promise<string | null> {
  if (!coords) return null;
  const link = mapsLink(coords);
  await Clipboard.setStringAsync(link);
  return link;
}

export async function placeCall(number: string): Promise<void> {
  await Linking.openURL(`tel:${number}`);
}
