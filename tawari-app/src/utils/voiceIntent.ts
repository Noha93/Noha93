import type { SosKey } from '../constants/services';
import type { Locale } from '../i18n/strings';

const KEYWORDS_AR: Record<SosKey, string[]> = {
  fire: ['حريق', 'حريقه', 'حريقة', 'نار', 'حراق', 'اتحرق', 'بيتحرق', 'دخان'],
  police: [
    'شرطة', 'شرطه', 'سرقة', 'سرقه', 'سرقوني', 'اتسرقت', 'حرامي', 'حراميه',
    'اعتداء', 'اعتدى', 'اعتديت', 'خطر', 'مطارد', 'بلطجة', 'ضرب', 'ضربني', 'تحرش', 'تهديد',
  ],
  amb: [
    'اسعاف', 'إسعاف', 'مريض', 'مريضة', 'جرح', 'جرحان', 'اصابة', 'إصابة',
    'اغماء', 'إغماء', 'ولادة', 'ولاده', 'نفسي', 'تنفس', 'قلب', 'حادثة', 'حادث', 'مصاب', 'دم',
  ],
};

const KEYWORDS_EN: Record<SosKey, string[]> = {
  fire: ['fire', 'burning', 'smoke', 'flames'],
  police: [
    'police', 'robbery', 'robbed', 'stolen', 'thief', 'attack', 'attacked',
    'danger', 'chasing', 'assault', 'hit me', 'harassment', 'threat', 'threatened',
  ],
  amb: [
    'ambulance', 'sick', 'injured', 'injury', 'wound', 'wounded', 'faint',
    'fainted', 'labor', 'birth', 'breathing', 'heart', 'accident', 'bleeding', 'hurt',
  ],
};

export interface VoiceIntentResult {
  key: SosKey | null;
  matchedWord: string | null;
}

function normalizeArabic(text: string): string {
  return text.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
}

export function matchVoiceIntent(transcript: string, locale: Locale = 'ar'): VoiceIntentResult {
  const keywords = locale === 'en' ? KEYWORDS_EN : KEYWORDS_AR;
  const normalized = locale === 'en' ? transcript.trim().toLowerCase() : normalizeArabic(transcript.trim());

  for (const key of Object.keys(keywords) as SosKey[]) {
    for (const word of keywords[key]) {
      const normalizedWord = locale === 'en' ? word.toLowerCase() : normalizeArabic(word);
      if (normalized.includes(normalizedWord)) {
        return { key, matchedWord: word };
      }
    }
  }
  return { key: null, matchedWord: null };
}
