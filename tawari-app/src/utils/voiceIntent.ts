import type { SosKey } from '../constants/services';

const KEYWORDS: Record<SosKey, string[]> = {
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

export interface VoiceIntentResult {
  key: SosKey | null;
  matchedWord: string | null;
}

export function matchVoiceIntent(transcript: string): VoiceIntentResult {
  const normalized = transcript
    .trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

  for (const key of Object.keys(KEYWORDS) as SosKey[]) {
    for (const word of KEYWORDS[key]) {
      const normalizedWord = word.replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
      if (normalized.includes(normalizedWord)) {
        return { key, matchedWord: word };
      }
    }
  }
  return { key: null, matchedWord: null };
}
