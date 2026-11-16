export class Audio {
  private context: AudioContext | null = null;
  volume = 0.4;
  unlock() {
    try {
      this.context ??= new AudioContext();
      void this.context.resume();
    } catch {
      /* Muted/unsupported audio never blocks the game. */
    }
  }
  tone(kind: 'hit' | 'block' | 'finisher') {
    if (!this.context || this.volume === 0) return;
    try {
      const ctx = this.context,
        o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = kind === 'finisher' ? 'triangle' : 'sine';
      const at = ctx.currentTime;
      o.frequency.setValueAtTime(kind === 'hit' ? 110 : kind === 'block' ? 330 : 440, at);
      o.frequency.exponentialRampToValueAtTime(kind === 'finisher' ? 880 : 65, at + 0.14);
      g.gain.setValueAtTime(this.volume * 0.18, at);
      g.gain.exponentialRampToValueAtTime(0.001, at + 0.25);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(at);
      o.stop(at + 0.26);
    } catch {
      /* Device audio interruptions are nonfatal. */
    }
  }
  destroy() {
    void this.context?.close();
  }
}
