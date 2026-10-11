// Web Audio API procedural sound effects & gentle background melody generator
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmTimer: any = null;
  private isBgmPlaying: boolean = false;

  private masterVol: number = 0.8;
  private sfxVol: number = 0.8;
  private bgmVol: number = 0.5;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(this.bgmVol, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolumes(master: number, bgm: number, sfx: number) {
    this.masterVol = master;
    this.bgmVol = bgm;
    this.sfxVol = sfx;
    if (this.ctx) {
      const t = this.ctx.currentTime;
      if (this.masterGain) this.masterGain.gain.setTargetAtTime(master, t, 0.05);
      if (this.bgmGain) this.bgmGain.gain.setTargetAtTime(bgm, t, 0.05);
      if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(sfx, t, 0.05);
    }
  }

  // Bark: cute puppy yip/bark
  public playBark() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(780, t + 0.05);
    osc.frequency.exponentialRampToValueAtTime(310, t + 0.18);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, t);
    filter.Q.setValueAtTime(3, t);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.7, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.19);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.2);

    // Second harmonic chirp for extra puppy cuteness
    const chirp = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();
    chirp.type = 'sine';
    chirp.frequency.setValueAtTime(850, t);
    chirp.frequency.exponentialRampToValueAtTime(520, t + 0.14);
    chirpGain.gain.setValueAtTime(0.25, t);
    chirpGain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
    chirp.connect(chirpGain);
    chirpGain.connect(this.sfxGain);
    chirp.start(t);
    chirp.stop(t + 0.15);
  }

  // Footstep patter
  public playFootstep() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 + Math.random() * 40, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.06);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.005, t + 0.06);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  // Jump boing
  public playJump() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.15);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.19);
  }

  // Bone collection sparkling chime
  public playBoneCollect() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const noteTime = t + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.25, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  }

  // Coin pickup chime
  public playCoin() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(987.77, t); // B5
    osc1.frequency.setValueAtTime(1318.51, t + 0.07); // E6

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(987.77 * 1.5, t);
    osc2.frequency.setValueAtTime(1318.51 * 1.5, t + 0.07);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.36);
    osc2.stop(t + 0.36);
  }

  // Ball bounce / kick sound
  public playBallBounce() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Water splash / swim sound
  public playSplash() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, t);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.11);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.12);
  }

  // Sniff sound
  public playSniff() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Small noise puff
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.Q.setValueAtTime(5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  // Quest completed fanfare
  public playQuestComplete() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const t = this.ctx.currentTime;

    // Fanfare chords: C - E - G - C5 - E5 - G5
    const arpeggio = [
      { f: 261.63, d: 0.08 },
      { f: 329.63, d: 0.08 },
      { f: 392.0, d: 0.08 },
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.15 },
      { f: 783.99, d: 0.35 },
    ];

    let currentT = t;
    arpeggio.forEach(({ f, d }, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = idx === arpeggio.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, currentT);

      gain.gain.setValueAtTime(0.25, currentT);
      gain.gain.exponentialRampToValueAtTime(0.001, currentT + d + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(currentT);
      osc.stop(currentT + d + 0.2);

      currentT += d;
    });
  }

  // Gentle procedural BGM (cozy marimba / music box melody in C Major pentatonic)
  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    const melody = [
      523.25, 0, 587.33, 659.25, 0, 783.99, 659.25, 0,
      523.25, 659.25, 0, 783.99, 880.0, 783.99, 659.25, 0,
    ];
    let step = 0;

    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

      const freq = melody[step % melody.length];
      step++;

      if (freq > 0 && this.bgmVol > 0.01) {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

        osc.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(t);
        osc.stop(t + 0.6);
      }

      this.bgmTimer = setTimeout(playNextNote, 280);
    };

    playNextNote();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const soundManager = new SoundManager();
