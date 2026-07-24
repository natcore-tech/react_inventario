// src/presentation/utils/audio.service.ts

/**
 * Web Audio API synthesizer service for low-latency Cyber-Noir sound feedback.
 */
class AudioService {
  private ctx: AudioContext | null = null
  private enabled = true

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_audio_enabled')
      this.enabled = saved !== null ? JSON.parse(saved) : true
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_audio_enabled', JSON.stringify(enabled))
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  /**
   * Sound 1: Cyber Neon Click / Add to Cart
   */
  public playClick() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, this.ctx.currentTime) // A5
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.08) // A6

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.08)
    } catch {
      // Ignore audio context errors
    }
  }

  /**
   * Sound 2: Soft Whoosh (Modal / Drawer Open)
   */
  public playWhoosh() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.15)

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.15)
    } catch {
      // Ignore
    }
  }

  /**
   * Sound 3: Ascending Victory Chord (Checkout Complete)
   */
  public playSuccess() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        const startTime = this.ctx.currentTime + idx * 0.07

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, startTime)

        gain.gain.setValueAtTime(0.15, startTime)
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(startTime)
        osc.stop(startTime + 0.3)
      })
    } catch {
      // Ignore
    }
  }
}

export const audioService = new AudioService()
