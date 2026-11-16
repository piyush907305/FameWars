import { describe, expect, it } from 'vitest';
import { DeviceProbe } from './index';
describe('device report arithmetic (synthetic samples, not phone measurements)', () => {
  it('excludes inactive time and completes only after the requested active duration', () => {
    const p = new DeviceProbe();
    p.start(100, 'test');
    p.frame(9999, false);
    p.frame(16, true); p.frame(33, true); p.frame(51, true);
    const r = p.report();
    expect(r.complete).toBe(true);
    expect(r.measuredActiveMs).toBe(100);
    expect(r.activeFrameSamples).toBe(3);
    expect(r.averageFps).toBe(30);
    expect(r.frameMs).toEqual({p50:33,p95:51,p99:51,max:51});
  });
  it('reports two-second windows and never joins separate active segments', () => {
    const p = new DeviceProbe();
    p.start(3000, 'test');
    for(let i=0;i<150;i++) p.frame(20,true);
    expect(p.report().minimumRollingTwoSecondFps).toBe(50);
    const q = new DeviceProbe(); q.start(3000,'test');
    for(let i=0;i<75;i++) q.frame(20,true);
    q.frame(5000,false);
    for(let i=0;i<75;i++) q.frame(20,true);
    expect(q.report().minimumRollingTwoSecondFps).toBeNull();
    expect(q.report().heapBytes).toBeNull();
  });
  it('marks bounded/truncated captures invalid and ignores invalid intervals', () => {
    const p = new DeviceProbe(2); p.start(300,'test');
    p.frame(NaN,true); p.frame(0,true); p.frame(-1,true);
    p.frame(100,true); p.frame(100,true); p.frame(100,true);
    expect(p.report()).toMatchObject({complete:true,validFrameTimeCapture:false,discardedFrameSamples:1,averageFps:null});
  });
});
