/**
 * Pure Web Audio API Sound Synthesizer for Plants vs. Zombies Web
 * No external audio files or dependencies needed - zero lag, works 100% offline!
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgmPlaying) {
      this.stopBgm();
      this.isBgmPlaying = true; // preserve state so unmute restores
    } else if (!muted && this.isBgmPlaying) {
      this.startBgm();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Sun collect chime (gentle harp/celesta arpeggio)
  public playSunCollect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.05);
      osc.stop(this.ctx!.currentTime + idx * 0.05 + 0.35);
    });
  }

  // Sun produced by Sunflower (sparkling, cheerful double harmonic chime)
  public playSunProduce() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [659.25, 880.0, 1046.5]; // E5, A5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.04);

      gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.04 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.04);
      osc.stop(this.ctx!.currentTime + idx * 0.04 + 0.28);
    });
  }

  // Quiz Answer Correct (Triumphant educational chime)
  public playQuizCorrect() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [659.25, 783.99, 1046.5, 1318.51]; // E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.25, this.ctx!.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.06 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.06);
      osc.stop(this.ctx!.currentTime + idx * 0.06 + 0.4);
    });
  }

  // Quiz Answer Wrong (Gentle educational buzz/oops)
  public playQuizWrong() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(130, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  // Plant placed down in soil (satisfying thump/dirt sound)
  public playPlant() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Peashooter / Snow pea shooting pop
  public playShoot(isIce: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isIce ? 'triangle' : 'sine';
    const startFreq = isIce ? 480 : 360;
    const endFreq = isIce ? 260 : 180;

    osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Pea hitting zombie
  public playHit(isIce: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isIce ? 550 : 220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isIce ? 180 : 80, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Zombie biting plant (crunch / chomp)
  public playChomp() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Zombie groan sound
  public playZombieGroan() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.35);
    osc.frequency.linearRampToValueAtTime(65, this.ctx.currentTime + 0.65);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.65);
  }

  // Cherry Bomb explosion
  public playExplosion() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Sub rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.7);

    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.7);

    // Noise blast
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.5);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.5);
  }

  // Lawn Mower engine roar
  public playLawnMower() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(260, this.ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.4);
  }

  // Huge Wave Siren warning
  public playHugeWave() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    for (let i = 0; i < 3; i++) {
      const startTime = this.ctx.currentTime + i * 0.28;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, startTime);
      osc.frequency.linearRampToValueAtTime(320, startTime + 0.22);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.24);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    }
  }

  // Perayaan Juara dg Musik Gembira (Upbeat, festive, joyful victory celebration track)
  public playVictory() {
    this.stopBgm();
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const baseT = this.ctx.currentTime + 0.05;

    // 1. Initial Brass Fanfare (Bright C major arpeggio burst)
    const fanfareNotes = [
      { f: 523.25, time: 0.0, dur: 0.16 }, // C5
      { f: 659.25, time: 0.18, dur: 0.16 }, // E5
      { f: 783.99, time: 0.36, dur: 0.16 }, // G5
      { f: 1046.5, time: 0.54, dur: 0.45 }, // C6
      { f: 880.0,  time: 1.02, dur: 0.18 }, // A5
      { f: 1046.5, time: 1.22, dur: 0.18 }, // C6
      { f: 1174.66,time: 1.42, dur: 0.18 }, // D6
      { f: 1318.51,time: 1.62, dur: 0.65 }  // E6
    ];

    fanfareNotes.forEach(({ f, time, dur }) => {
      const t = baseT + time;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.24, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + dur);
    });

    // 2. Joyful Upbeat Melody & Harmonic Celebration
    const melody = [
      { f: 1046.5, time: 2.35, dur: 0.18 },
      { f: 1046.5, time: 2.56, dur: 0.14 },
      { f: 1174.66, time: 2.74, dur: 0.18 },
      { f: 1318.51, time: 2.95, dur: 0.32 },
      { f: 1174.66, time: 3.32, dur: 0.18 },
      { f: 1046.5, time: 3.53, dur: 0.32 },
      { f: 880.0, time: 3.9, dur: 0.18 },
      { f: 1046.5, time: 4.12, dur: 0.18 },
      { f: 1174.66, time: 4.34, dur: 0.18 },
      { f: 1318.51, time: 4.56, dur: 0.22 },
      { f: 1567.98, time: 4.82, dur: 0.85 } // High G6 grand triumph!
    ];

    melody.forEach(({ f, time, dur }) => {
      const t = baseT + time;
      const osc = this.ctx!.createOscillator();
      const oscHarmonic = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      oscHarmonic.type = 'triangle';
      osc.frequency.setValueAtTime(f, t);
      oscHarmonic.frequency.setValueAtTime(f * 2, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      oscHarmonic.start(t);
      osc.stop(t + dur);
      oscHarmonic.stop(t + dur);
    });

    // 3. Celebratory Chimes & Bells Sparkle
    const sparkles = [1046.5, 1318.51, 1567.98, 2093.0];
    for (let i = 0; i < 12; i++) {
      const t = baseT + 1.8 + i * 0.26;
      const f = sparkles[i % sparkles.length];
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    }
  }

  // Musik Mencekam: The Zombies Ate Your Brains! (Spooky, chilling, eerie horror theme)
  public playGameOver() {
    this.stopBgm();
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const baseT = this.ctx.currentTime + 0.05;

    // 1. Terrifying Pitch-Dive Screech ("NOOOOOOO!")
    const screech = this.ctx.createOscillator();
    const screechGain = this.ctx.createGain();
    screech.type = 'sawtooth';
    screech.frequency.setValueAtTime(740, baseT);
    screech.frequency.exponentialRampToValueAtTime(95, baseT + 1.2);

    screechGain.gain.setValueAtTime(0.35, baseT);
    screechGain.gain.exponentialRampToValueAtTime(0.005, baseT + 1.25);

    screech.connect(screechGain);
    screechGain.connect(this.ctx.destination);
    screech.start(baseT);
    screech.stop(baseT + 1.25);

    // 2. Heavy Sub-Bass Doom Impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(65, baseT);
    subOsc.frequency.exponentialRampToValueAtTime(28, baseT + 2.0);

    subGain.gain.setValueAtTime(0.6, baseT);
    subGain.gain.exponentialRampToValueAtTime(0.005, baseT + 2.0);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(baseT);
    subOsc.stop(baseT + 2.0);

    // 3. Eerie, Menacing Suspense Motif (Slow, chilling minor notes like a horror funeral organ)
    const spookyNotes = [
      { f: 146.83, time: 1.3, dur: 0.9 }, // D3
      { f: 155.56, time: 2.2, dur: 0.8 }, // Eb3 (Dissonant minor 2nd)
      { f: 138.59, time: 3.0, dur: 0.9 }, // C#3 (Eerie tritone dissonance)
      { f: 103.83, time: 3.9, dur: 1.1 }, // G#2 (Creepy drop)
      { f: 87.31,  time: 5.0, dur: 1.8 }  // Low F2 (Final doom chord)
    ];

    spookyNotes.forEach(({ f, time, dur }) => {
      const t = baseT + time;
      const osc1 = this.ctx!.createOscillator();
      const osc2 = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      const gain = this.ctx!.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(f, t);
      osc2.frequency.setValueAtTime(f * 1.015, t); // detuned for eerie tension

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, t);
      filter.frequency.linearRampToValueAtTime(180, t + dur);

      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.002, t + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx!.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + dur);
      osc2.stop(t + dur);
    });

    // 4. Ghostly low wind / shudder noise in the background
    const bufferSize = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(220, baseT + 1.0);
    noiseFilter.frequency.linearRampToValueAtTime(140, baseT + 3.5);
    noiseFilter.Q.value = 4.0;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, baseT + 1.0);
    noiseGain.gain.linearRampToValueAtTime(0.12, baseT + 2.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, baseT + 3.5);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(baseT + 1.0);
    noise.stop(baseT + 3.5);
  }

  // Whimsical PvZ style BGM loop
  public startBgm() {
    this.isBgmPlaying = true;
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || this.bgmInterval) return;

    const bassLine = [
      130.81, 130.81, 164.81, 196.0,  // C3, C3, E3, G3
      174.61, 174.61, 220.0, 130.81,  // F3, F3, A3, C3
      146.83, 146.83, 174.61, 220.0,  // D3, D3, F3, A3
      196.0, 196.0, 246.94, 293.66    // G3, G3, B3, D4
    ];

    const melodyLine = [
      523.25, 0, 587.33, 659.25,
      698.46, 659.25, 587.33, 523.25,
      440.0, 0, 493.88, 523.25,
      392.0, 440.0, 493.88, 523.25
    ];

    let step = 0;
    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;

      const t = this.ctx.currentTime;
      const bassFreq = bassLine[step % bassLine.length];
      const melodyFreq = melodyLine[step % melodyLine.length];

      // Bass note
      if (bassFreq > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassFreq, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      }

      // Marimba melody note
      if (melodyFreq > 0) {
        const oscM = this.ctx.createOscillator();
        const gainM = this.ctx.createGain();
        oscM.type = 'sine';
        oscM.frequency.setValueAtTime(melodyFreq, t);
        gainM.gain.setValueAtTime(0.06, t);
        gainM.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        oscM.connect(gainM);
        gainM.connect(this.ctx.destination);
        oscM.start(t);
        oscM.stop(t + 0.2);
      }

      step++;
    }, 240); // ~125 BPM
  }

  public stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
