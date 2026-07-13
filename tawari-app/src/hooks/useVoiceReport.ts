import { useCallback, useRef, useState } from 'react';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { matchVoiceIntent } from '../utils/voiceIntent';
import type { SosKey } from '../constants/services';
import type { Locale } from '../i18n/strings';

export type VoiceStatus = 'idle' | 'listening' | 'no-match' | 'error';

interface UseVoiceReportOptions {
  locale: Locale;
  onMatch: (key: SosKey, transcript: string) => void;
}

export function useVoiceReport({ locale, onMatch }: UseVoiceReportOptions) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const transcriptRef = useRef('');
  const localeRef = useRef(locale);
  localeRef.current = locale;

  useSpeechRecognitionEvent('start', () => {
    transcriptRef.current = '';
    setTranscript('');
    setStatus('listening');
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript ?? '';
    transcriptRef.current = text;
    setTranscript(text);
  });

  useSpeechRecognitionEvent('end', () => {
    const finalText = transcriptRef.current;
    if (!finalText) {
      setStatus('idle');
      return;
    }
    const { key } = matchVoiceIntent(finalText, localeRef.current);
    if (key) {
      setStatus('idle');
      onMatch(key, finalText);
    } else {
      setStatus('no-match');
    }
  });

  useSpeechRecognitionEvent('error', () => {
    setStatus('error');
  });

  const startListening = useCallback(async () => {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      setStatus('error');
      return;
    }
    ExpoSpeechRecognitionModule.start({
      lang: localeRef.current === 'en' ? 'en-US' : 'ar-EG',
      interimResults: true,
      continuous: false,
    });
  }, []);

  const stopListening = useCallback(() => {
    ExpoSpeechRecognitionModule.stop();
  }, []);

  return { status, transcript, startListening, stopListening };
}
