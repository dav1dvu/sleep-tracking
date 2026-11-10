// Pure Web Audio API Synthesizer - 100% Offline, Zero external assets, Zero latency

export type SoundType = 'brown' | 'pink' | 'white' | 'rain' | 'theta';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying: boolean = false;
  private activeSound: SoundType | null = null;
  private timerId: any = null;
  private stopCallback: (() => void) | null = null;

  constructor() {
    // Mobile touch unlock listener
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      };
      window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: SoundType, volume: number = 0.5, timerMinutes: number = 0, onStop?: () => void) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.stopCallback = onStop || null;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Fade-in smoothly over 1.5 seconds
    this.gainNode.gain.exponentialRampToValueAtTime(
      Math.max(0.01, Math.min(1, volume)),
      this.ctx.currentTime + 1.5
    );

    if (type === 'brown') {
      this.playBrownNoise();
    } else if (type === 'pink') {
      this.playPinkNoise();
    } else if (type === 'white') {
      this.playWhiteNoise();
    } else if (type === 'rain') {
      this.playRainSound();
    } else if (type === 'theta') {
      this.playThetaBinaural();
    }

    this.isPlaying = true;
    this.activeSound = type;

    if (timerMinutes > 0) {
      if (this.timerId) clearTimeout(this.timerId);
      this.timerId = setTimeout(() => {
        this.stopWithFade(3);
      }, timerMinutes * 60 * 1000);
    }
  }

  private playBrownNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise tích lũy với hệ số rò rỉ
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain boost vì năng lượng dồn về tần số thấp
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter nhẹ để cắt tiếng rít cao
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.gainNode);
    noiseSource.start();
    this.currentSource = noiseSource;
  }

  private playPinkNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    source.connect(this.gainNode);
    source.start();
    this.currentSource = source;
  }

  private playWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filter nhẹ để không chói tai
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(this.gainNode);
    source.start();
    this.currentSource = source;
  }

  private playRainSound() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Trộn âm thanh mưa (nhiễu hồng + lọc dải)
      last = 0.96 * last + 0.04 * white;
      data[i] = last * 1.8;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Dùng Bandpass + Lowpass filter tạo hiệu ứng giọt mưa rơi
    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(900, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.8, this.ctx.currentTime);

    // LFO (Bộ dao động tần số thấp) tạo tiếng gió mưa dập dềnh
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // 0.2 Hz chu kỳ 5 giây
    lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);
    lfo.start();

    source.connect(bandpass);
    bandpass.connect(this.gainNode);
    source.start();
    this.currentSource = source;
  }

  private playThetaBinaural() {
    if (!this.ctx || !this.gainNode) return;
    // Tần số sóng não Theta: 6Hz (Khuyến khích giấc ngủ sâu, thiền định)
    // Tai trái: 200Hz, Tai phải: 206Hz -> Não bộ đồng bộ tạo ra sóng 6Hz Theta
    const merger = this.ctx.createChannelMerger(2);

    const oscLeft = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(196, this.ctx.currentTime);

    const oscRight = this.ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(202, this.ctx.currentTime); // 6Hz diff

    oscLeft.connect(merger, 0, 0); // Kênh trái
    oscRight.connect(merger, 0, 1); // Kênh phải

    merger.connect(this.gainNode);
    oscLeft.start();
    oscRight.start();

    this.currentSource = merger as any;
  }

  public setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.gainNode.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  public stopWithFade(fadeSeconds: number = 1.0) {
    if (this.gainNode && this.ctx && this.isPlaying) {
      try {
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + fadeSeconds);
        setTimeout(() => {
          this.stop();
        }, fadeSeconds * 1000);
      } catch {
        this.stop();
      }
    } else {
      this.stop();
    }
  }

  public stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.currentSource) {
      try {
        (this.currentSource as any).stop?.();
        (this.currentSource as any).disconnect?.();
      } catch {}
      this.currentSource = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {}
      this.gainNode = null;
    }
    this.isPlaying = false;
    this.activeSound = null;
    if (this.stopCallback) {
      this.stopCallback();
      this.stopCallback = null;
    }
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      activeSound: this.activeSound,
    };
  }
}

export const soundEngine = new SoundEngine();
