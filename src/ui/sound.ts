/**
 * Procedural sound — every effect is synthesized with the Web Audio API, so
 * there are no audio asset files (stays in the emoji + code model). One shared
 * AudioContext is created lazily on the first play() call, which always happens
 * inside a user gesture (a tap), satisfying browser autoplay rules.
 */

type SoundName = 'select' | 'match' | 'merge' | 'invalid' | 'win' | 'lose';

let ctx: AudioContext | null = null;
let muted = false;

/** Lazily create/resume the shared AudioContext. Returns null if unsupported. */
function audio(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/**
 * Plays one short tone with a percussive envelope.
 * @param freq start frequency (Hz)
 * @param freqEnd end frequency for a glide (defaults to freq)
 * @param dur duration in seconds
 * @param type oscillator waveform
 * @param gain peak volume 0..1
 * @param delay start offset in seconds (for chords/arpeggios)
 */
function tone(freq: number, freqEnd: number, dur: number, type: OscillatorType, gain: number, delay = 0): void {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const env = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (freqEnd !== freq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), t0 + dur);
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(env).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Notes (Hz) for cheerful arpeggios. */
const C5 = 523, E5 = 659, G5 = 784, C6 = 1046;

/** Play a named sound effect. Safe to call anywhere; no-ops when muted/unsupported. */
export function play(name: SoundName): void {
  switch (name) {
    case 'select':
      tone(440, 560, 0.06, 'triangle', 0.12);
      break;
    case 'match':
      tone(E5, G5, 0.12, 'triangle', 0.18);
      tone(G5, C6, 0.12, 'sine', 0.1, 0.04);
      break;
    case 'merge':
      tone(C5, C6, 0.16, 'sawtooth', 0.14);
      break;
    case 'invalid':
      tone(180, 90, 0.16, 'sawtooth', 0.16);
      break;
    case 'win':
      [C5, E5, G5, C6].forEach((f, i) => tone(f, f, 0.16, 'triangle', 0.2, i * 0.1));
      break;
    case 'lose':
      tone(330, 160, 0.5, 'triangle', 0.18);
      break;
  }
}

/** Toggle all sound. Returns the new muted state (persist/reflect in the ui as you like). */
export function toggleMute(): boolean {
  muted = !muted;
  return muted;
}

/** Current muted state. */
export function isMuted(): boolean {
  return muted;
}
