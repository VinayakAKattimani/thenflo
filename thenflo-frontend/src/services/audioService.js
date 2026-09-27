import { request, mockDelay } from './apiClient.js';
import { USE_MOCK } from './config.js';

/** Speech-to-text: transcribe a recorded audio blob. */
export async function transcribeAudio(audioBlob) {
  if (USE_MOCK.audio) {
    await mockDelay(900);
    return { text: 'This is a placeholder transcript. Connect audioService to POST /audio/stt/ for real transcription.' };
  }
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  // Real Gateway path per the brief: POST /audio/stt/ (multipart)
  return request('/audio/stt/', { method: 'POST', body: formData, isFormData: true });
}

/** Text-to-speech: synthesize audio for a piece of text. */
export async function synthesizeSpeech(text) {
  if (USE_MOCK.audio) {
    await mockDelay(700);
    return { audioUrl: null, note: 'Mock TTS — connect audioService to POST /audio/tts/ for real audio.' };
  }
  // Real Gateway path per the brief: POST /audio/tts/  body: { text }
  const blob = await request('/audio/tts/', { method: 'POST', body: { text } });
  return { audioUrl: URL.createObjectURL(blob) };
}

export async function checkAudioHealth() {
  if (USE_MOCK.audio) {
    await mockDelay(200);
    return { status: 'mock' };
  }
  return request('/audio/health/');
}
