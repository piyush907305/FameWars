export class DeviceProbe {
  private intervals: number[] = [];
  private segments: number[] = [];
  private wasActive = false;
  private discarded = 0;
  private heap: number[] = [];
  targetMs = 0;
  activeMs = 0;
  running = false;
  startedAt = '';
  constructor(private readonly maxSamples = 200000) {}
  start(targetMs: number, startedAt: string): void {
    if (!Number.isFinite(targetMs) || targetMs <= 0) throw new Error('Invalid duration');
    this.targetMs = targetMs;
    this.startedAt = startedAt;
    this.activeMs = 0;
    this.intervals = [];
    this.segments = [];
    this.heap = [];
    this.discarded = 0;
    this.wasActive = false;
    this.running = true;
  }
  frame(deltaMs: number, active: boolean): void {
    if (!active) this.wasActive = false;
    if (!this.running || !active || !Number.isFinite(deltaMs) || deltaMs <= 0) return;
    this.activeMs += deltaMs;
    if (this.intervals.length < this.maxSamples) {
      if (!this.wasActive) this.segments.push(this.intervals.length);
      this.intervals.push(deltaMs);
    } else this.discarded++;
    this.wasActive = true;
    if (this.activeMs >= this.targetMs) this.running = false;
  }
  observeHeap(bytes: number | undefined): void {
    if (this.running && bytes !== undefined && Number.isFinite(bytes) && bytes >= 0)
      this.heap.push(bytes);
  }
  report() {
    const sorted = [...this.intervals].sort((a, b) => a - b);
    const percentile = (p: number): number | null =>
      sorted.length ? sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)]! : null;
    let minimumRollingFps: number | null = null;
    const starts = [...this.segments, this.intervals.length];
    for (let segment = 0; segment + 1 < starts.length; segment++) {
      let left = starts[segment]!, elapsed = 0;
      for (let right = left; right < starts[segment + 1]!; right++) {
        elapsed += this.intervals[right]!;
        while (left < right && elapsed - this.intervals[left]! >= 2000)
          elapsed -= this.intervals[left++]!;
        if (elapsed >= 2000) {
          const fps = ((right - left + 1) * 1000) / elapsed;
          minimumRollingFps = minimumRollingFps === null ? fps : Math.min(minimumRollingFps, fps);
        }
      }
    }
    return {
      schemaVersion: 1,
      startedAt: this.startedAt,
      requestedActiveMs: this.targetMs,
      measuredActiveMs: this.activeMs,
      complete: this.targetMs > 0 && this.activeMs >= this.targetMs,
      validFrameTimeCapture: this.targetMs > 0 && this.activeMs >= this.targetMs && this.discarded === 0,
      activeFrameSamples: sorted.length,
      discardedFrameSamples: this.discarded,
      averageFps: sorted.length && !this.discarded ? (sorted.length * 1000) / this.activeMs : null,
      minimumRollingTwoSecondFps: minimumRollingFps,
      frameMs: { p50: percentile(.5), p95: percentile(.95), p99: percentile(.99), max: sorted.at(-1) ?? null },
      heapBytes: this.heap.length ? { min: Math.min(...this.heap), max: Math.max(...this.heap), last: this.heap.at(-1), samples: this.heap.length } : null,
      heapMethod: 'Optional Chromium performance.memory samples; not total browser/GPU memory or a post-GC measurement.',
      scope: 'Foreground unpaused gameplay and finishers only. Menus, settings, results and hidden-tab time excluded. Two-second windows never bridge inactive segments.',
      manualObservationsRequired: ['phone model/RAM', 'Android and browser versions', 'cold load to first movement', 'battery start/end', 'heat/throttling observations', 'touch/game-feel notes'],
    };
  }
}
