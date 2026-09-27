import React, { useRef, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import * as audioService from '../../services/audioService.js';
import { MicIcon, StopIcon } from '../../components/common/Icons.jsx';
import './Voice.css';

export default function Voice() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micError, setMicError] = useState(null);
  const [ttsText, setTtsText] = useState('');
  const [synthesizing, setSynthesizing] = useState(false);
  const [ttsNote, setTtsNote] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setTranscribing(true);
        const { text } = await audioService.transcribeAudio(blob);
        setTranscript(text);
        setTranscribing(false);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      setMicError('Microphone access was denied or is unavailable.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleSynthesize = async (e) => {
    e.preventDefault();
    if (!ttsText.trim()) return;
    setSynthesizing(true);
    setTtsNote(null);
    const { audioUrl, note } = await audioService.synthesizeSpeech(ttsText.trim());
    setTtsNote(note || (audioUrl ? 'Ready to play.' : null));
    setSynthesizing(false);
  };

  return (
    <div className="voice-page">
      <PageHeader title="Voice" subtitle="Talk naturally with ThenFLo." />

      <div className="voice-panels">
        <section className="voice-panel">
          <h3>Speak to ThenFLo</h3>
          <p className="voice-panel-hint">Record a message and ThenFLo will transcribe it.</p>

          <button
            className={'voice-record-btn' + (recording ? ' is-recording' : '')}
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? <StopIcon /> : <MicIcon />}
            {recording ? 'Stop recording' : 'Start recording'}
          </button>

          {micError && <p className="voice-error">{micError}</p>}

          <div className="voice-transcript">
            {transcribing ? (
              <p className="voice-panel-hint">Transcribing…</p>
            ) : transcript ? (
              <p>{transcript}</p>
            ) : (
              <p className="voice-panel-hint">Your transcript will appear here.</p>
            )}
          </div>
        </section>

        <section className="voice-panel">
          <h3>Hear ThenFLo speak</h3>
          <p className="voice-panel-hint">Enter text and ThenFLo will read it aloud.</p>

          <form onSubmit={handleSynthesize} className="voice-tts-form">
            <textarea
              value={ttsText}
              onChange={(e) => setTtsText(e.target.value)}
              placeholder="Type something for ThenFLo to say…"
              rows={4}
            />
            <button type="submit" className="btn btn-primary" disabled={synthesizing || !ttsText.trim()}>
              {synthesizing ? 'Synthesizing…' : 'Speak'}
            </button>
          </form>

          {ttsNote && <p className="voice-panel-hint voice-tts-note">{ttsNote}</p>}
        </section>
      </div>
    </div>
  );
}
