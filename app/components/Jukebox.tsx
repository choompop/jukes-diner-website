'use client';

import { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, SkipForward, Volume2, X } from 'lucide-react';

type Track = {
  title: string;
  mood: string;
  tempo: number;
  key: number;
  progression: number[];
};

const PLAYLIST = [
  { title: 'Chrome Counter Boogie', mood: 'sock-hop piano', tempo: 142, key: 261.63, progression: [0, 4, 7, 9] },
  { title: 'Blue Plate Special', mood: 'slow-dance doo-wop', tempo: 92, key: 293.66, progression: [0, 3, 7, 10] },
  { title: 'Milkshake Twist', mood: 'hand-clap shuffle', tempo: 156, key: 329.63, progression: [0, 5, 7, 12] },
  { title: 'Neon Booth Serenade', mood: 'late-night crooner', tempo: 78, key: 246.94, progression: [0, 4, 5, 7] },
  { title: 'Route 615 Rock', mood: 'roadside rockabilly', tempo: 168, key: 220, progression: [0, 7, 9, 12] },
  { title: 'Waffle Iron Waltz', mood: 'three-quarter diner sway', tempo: 112, key: 349.23, progression: [0, 4, 9, 7] },
  { title: 'Checkerboard Stroll', mood: 'walking bass classic', tempo: 128, key: 196, progression: [0, 3, 5, 7] },
  { title: 'Last Call Jangle', mood: 'closing-time jukebox glow', tempo: 104, key: 277.18, progression: [0, 5, 8, 10] },
] satisfies Track[];

const NOTE_SYMBOLS = ['♪', '♫', '♬', '♩'];

type BrowserAudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

export default function Jukebox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.28);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);

  const currentTrack = PLAYLIST[trackIndex];

  useEffect(() => {
    masterGainRef.current?.gain.setTargetAtTime(volume, masterGainRef.current.context.currentTime, 0.04);
  }, [volume]);

  useEffect(() => () => {
    stopLoop();
    audioContextRef.current?.close().catch(() => undefined);
  }, []);

  function ensureAudioContext() {
    if (audioContextRef.current) return audioContextRef.current;

    const AudioContextClass = window.AudioContext || (window as BrowserAudioWindow).webkitAudioContext;
    const context = new AudioContextClass();
    const masterGain = context.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(context.destination);
    audioContextRef.current = context;
    masterGainRef.current = masterGain;
    return context;
  }

  function playTone(context: AudioContext, frequency: number, startTime: number, duration: number, gainAmount = 0.08) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(gainAmount, startTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(masterGainRef.current || context.destination);
    activeOscillatorsRef.current.push(oscillator);
    oscillator.addEventListener('ended', () => {
      activeOscillatorsRef.current = activeOscillatorsRef.current.filter((active) => active !== oscillator);
    });
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.02);
  }

  function scheduleBar(track: Track) {
    const context = ensureAudioContext();
    const secondsPerBeat = 60 / track.tempo;
    const now = context.currentTime + 0.02;

    track.progression.forEach((step, index) => {
      const start = now + index * secondsPerBeat;
      const root = track.key * Math.pow(2, step / 12);
      playTone(context, root, start, secondsPerBeat * 0.82, 0.07);
      playTone(context, root * 1.5, start + secondsPerBeat * 0.08, secondsPerBeat * 0.5, 0.045);
      playTone(context, root * 2, start + secondsPerBeat * 0.5, secondsPerBeat * 0.3, 0.035);
    });
  }

  function startLoop(track: Track) {
    stopLoop();
    const context = ensureAudioContext();
    if (context.state === 'suspended') {
      context.resume().catch(() => undefined);
    }
    scheduleBar(track);
    const barLength = (60 / track.tempo) * track.progression.length * 1000;
    timerRef.current = window.setInterval(() => scheduleBar(track), barLength);
  }

  function beginPlayback(index: number) {
    const track = PLAYLIST[index];
    setIsOpen(true);
    setTrackIndex(index);
    startLoop(track);
    setIsPlaying(true);
  }

  function stopLoop() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    activeOscillatorsRef.current.forEach((oscillator) => oscillator.stop());
    activeOscillatorsRef.current = [];
  }

  function togglePlayback() {
    if (isPlaying) {
      stopLoop();
      setIsPlaying(false);
      return;
    }

    beginPlayback(trackIndex);
  }

  function selectTrack(index: number) {
    beginPlayback(index);
  }

  function nextTrack() {
    beginPlayback((trackIndex + 1) % PLAYLIST.length);
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {isPlaying && (
        <div aria-hidden="true" className="pointer-events-none absolute bottom-24 right-80 h-48 w-36 overflow-visible">
          {NOTE_SYMBOLS.map((note, index) => (
            <span
              key={`${note}-${index}`}
              className="jukebox-note absolute bottom-0 rounded-full border-2 border-diner-black bg-diner-cream px-2 py-1 text-2xl font-black text-diner-red shadow-[3px_3px_0_#171717]"
              style={{
                right: `${index * 1.7}rem`,
                animationDelay: `${index * 0.28}s`,
              }}
            >
              {note}
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <section
          role="dialog"
          aria-label="Juke's Diner retro jukebox"
          className="pointer-events-auto absolute bottom-28 right-5 max-h-[min(32rem,calc(100vh-12rem))] w-[min(21rem,calc(100vw-2rem))] overflow-y-auto overflow-x-hidden rounded-[2rem] border-4 border-diner-black bg-diner-cream shadow-[8px_8px_0_#171717]"
        >
          <div className="checker-strip border-b-4 border-diner-black bg-diner-red p-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-[0.25em]">Now spinning</p>
                <h2 className="text-4xl leading-none">Jukebox</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border-3 border-diner-black bg-white p-2 text-diner-black shadow-[3px_3px_0_#171717]"
                aria-label="Close jukebox"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="rounded-3xl border-4 border-diner-black bg-white p-4 text-center shadow-[5px_5px_0_#171717]">
              <p className="font-mono text-xs font-black uppercase tracking-[0.25em] text-[#087879]">Now spinning</p>
              <p className="mt-1 font-display text-4xl leading-none text-diner-black">{currentTrack.title}</p>
              <p className="mt-2 text-sm font-bold text-diner-black">{currentTrack.mood}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={togglePlayback} className="retro-button bg-diner-red px-3 py-3 text-xs text-white">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button type="button" onClick={nextTrack} className="retro-button bg-diner-teal px-3 py-3 text-xs text-diner-black">
                <SkipForward className="h-4 w-4" />
                <span className="sr-only">Next track</span>
              </button>
              <label className="flex items-center justify-center gap-1 rounded-full border-4 border-diner-black bg-white px-3 py-2 shadow-[5px_5px_0_#171717]">
                <Volume2 className="h-4 w-4" />
                <input
                  aria-label="Jukebox volume"
                  className="w-12 accent-diner-red"
                  type="range"
                  min="0"
                  max="0.6"
                  step="0.05"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                />
              </label>
            </div>

            <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
              {PLAYLIST.map((track, index) => (
                <button
                  type="button"
                  key={track.title}
                  onClick={() => selectTrack(index)}
                  className={`w-full rounded-2xl border-2 border-diner-black px-4 py-3 text-left font-bold transition-transform hover:-translate-y-0.5 ${index === trackIndex ? 'bg-diner-teal text-diner-black' : 'bg-white text-diner-black'}`}
                  aria-pressed={index === trackIndex}
                >
                  <span className="font-mono text-xs">{String(index + 1).padStart(2, '0')}</span> {track.title}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold leading-5 text-diner-black">
              Browser-generated retro instrumentals — diner energy without embedding copyrighted tracks.
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Pause jukebox' : 'Open jukebox'}
        className="pointer-events-auto absolute bottom-5 right-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-diner-black bg-diner-red text-white shadow-[7px_7px_0_#171717] transition-transform hover:-translate-y-1 active:translate-y-0"
      >
        {isPlaying ? <Pause className="h-8 w-8" /> : <Music className="h-8 w-8" />}
      </button>
    </div>
  );
}
