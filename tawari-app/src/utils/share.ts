import { Linking, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as SMS from 'expo-sms';

export interface Coords {
  lat: number;
  lng: number;
}

export function mapsLink(coords: Coords): string {
  return `https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function emergencyMessage(coords: Coords | null, contextLabel?: string): string {
  const lines = ['🚨 حالة طوارئ', 'أحتاج إلى المساعدة.'];
  if (contextLabel) lines.push(`(بعد الاتصال بـ ${contextLabel})`);
  lines.push('هذا هو موقعي الحالي:');
  lines.push(coords ? mapsLink(coords) : 'الموقع غير متاح حاليًا');
  lines.push('يرجى التواصل معي أو إرسال المساعدة.');
  lines.push(`🕓 ${formatTimestamp(new Date())}`);
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
