import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { content, lineFor } from '@fame/content';
import { createMatch, step, type MatchState } from '@fame/sim';
import { cpuInput, type Difficulty } from '@fame/ai';
import { Renderer } from './render';
import { Audio } from './audio';
import { InputManager, defaults, actionNames } from './input';
import { text, type Language } from './ui/i18n';
import './ui/style.css';
type Screen = 'disclaimer' | 'title' | 'select' | 'fight' | 'result';
type Runtime = {
  state: MatchState;
  previous: MatchState;
  input: InputManager;
  renderer: Renderer;
  audio: Audio;
  skip: boolean;
};
const read = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};
const store = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Private mode may reject storage. */
  }
};
function App() {
  const [lang, setLang] = useState<Language>(read('fame.lang', 'en') === 'hi' ? 'hi' : 'en'),
    [screen, setScreen] = useState<Screen>(
      read('fame.disclaimer', '') === '1' ? 'title' : 'disclaimer',
    ),
    [adult, setAdult] = useState(false),
    [mode, setMode] = useState<'cpu' | 'local'>('cpu'),
    [difficulty, setDifficulty] = useState<Difficulty>('normal'),
    [selected, setSelected] = useState<[string, string]>(['dynamo', 'chalk']),
    [slot, setSlot] = useState<0 | 1>(0),
    [paused, setPaused] = useState(false),
    [settings, setSettings] = useState(false),
    [volume, setVolume] = useState(Number(read('fame.volume', '.4'))),
    [reduced, setReduced] = useState(
      read('fame.reduced', '') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
    [debug, setDebug] = useState(false),
    [snapshot, setSnapshot] = useState(() => createMatch(content)),
    [fps, setFps] = useState(0),
    [draws, setDraws] = useState(0),
    [bindingRevision, setBindingRevision] = useState(0),
    [remapping, setRemapping] = useState<{ slot: 0 | 1; action: string } | null>(null),
    [error, setError] = useState('');
  const canvas = useRef<HTMLCanvasElement>(null),
    runtime = useRef<Runtime | null>(null);
  const options = useRef({ screen, paused, settings, mode, difficulty, reduced, debug, volume });
  options.current = { screen, paused, settings, mode, difficulty, reduced, debug, volume };
  const t = text[lang];
  useEffect(() => {
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    store('fame.lang', lang);
  }, [lang]);
  useEffect(() => {
    let renderer: Renderer;
    try {
      renderer = new Renderer(canvas.current!, ['dynamo', 'chalk']);
    } catch (e) {
      setError(String(e));
      return;
    }
    const input = new InputManager(),
      audio = new Audio();
    try {
      const saved = JSON.parse(read('fame.bindings', 'null')) as unknown;
      if (
        Array.isArray(saved) &&
        saved.length === 2 &&
        saved.every(
          (x) => x && typeof x === 'object' && actionNames.every((k) => typeof x[k] === 'string'),
        )
      )
        input.bindings = saved as typeof input.bindings;
    } catch {
      /* Restore defaults for malformed saves. */
    }
    const initial = createMatch(content);
    const rt: Runtime = { renderer, input, audio, state: initial, previous: initial, skip: false };
    runtime.current = rt;
    let last = performance.now(),
      accumulator = 0,
      raf = 0,
      frames = 0,
      measureStart = last;
    let prevView = '';
    const intervals: number[] = [];
    const frame = (now: number) => {
      const o = options.current;
      const delta = Math.max(0, now - last);
      last = now;
      renderer.reduced = o.reduced;
      renderer.debug = o.debug;
      renderer.style =
        new URLSearchParams(location.search).get('view') === 'boxes' ? 'boxes' : '3d';
      audio.volume = o.volume;
      if (o.screen === 'fight' && !o.paused && !o.settings && !document.hidden) {
        accumulator += delta;
        let ticks = 0;
        while (accumulator >= 1000 / 60 && ticks++ < 5) {
          const pads = Array.from(navigator.getGamepads?.() ?? []).filter(
            (p): p is Gamepad => p !== null,
          );
          const p1 = input.sample(0, pads),
            p2 = o.mode === 'cpu' ? cpuInput(rt.state, 1, o.difficulty) : input.sample(1, pads);
          if (rt.skip) {
            p1.skip = true;
            rt.skip = false;
          }
          rt.previous = rt.state;
          rt.state = step(rt.state, [p1, p2], content);
          accumulator -= 1000 / 60;
          for (const e of rt.state.events)
            if (e.kind === 'hit' || e.kind === 'block' || e.kind === 'finisher') audio.tone(e.kind);
          if (rt.state.phase === 'matchResult') {
            setScreen('result');
            break;
          }
        }
      } else accumulator = 0;
      renderer.draw(rt.state, rt.previous, Math.min(1, accumulator / (1000 / 60)));
      if (o.debug && o.screen === 'fight' && !o.paused && delta > 0) {
        intervals.push(delta);
        if (intervals.length > 3600) intervals.shift();
      }
      canvas.current!.dataset.draws = String(renderer.drawCalls);
      canvas.current!.dataset.triangles = String(renderer.triangles);
      frames++;
      if (now - measureStart >= 500) {
        setFps(Math.round((frames * 1000) / (now - measureStart)));
        setDraws(renderer.drawCalls);
        if (o.debug) canvas.current!.dataset.frameIntervals = JSON.stringify(intervals);
        frames = 0;
        measureStart = now;
      }
      const viewKey = `${rt.state.tick >> 2}:${rt.state.phase}`;
      if (viewKey !== prevView) {
        setSnapshot(rt.state);
        prevView = viewKey;
      }
      // Read-only diagnostics, no sim mutation or debug win/health shortcuts.
      canvas.current!.dataset.tick = String(rt.state.tick);
      canvas.current!.dataset.phase = rt.state.phase;
      canvas.current!.dataset.hash = String(rt.state.rng);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const blur = () => {
      input.clear();
      if (options.current.screen === 'fight') setPaused(true);
    };
    const key = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && options.current.screen === 'fight') {
        setPaused((x) => !x);
        input.clear();
      }
      if (e.code === 'Backquote') setDebug((x) => !x);
    };
    const orientationQuery = matchMedia('(max-width:900px) and (orientation:portrait)');
    const orientationChange = () => {
      if (orientationQuery.matches) blur();
    };
    orientationQuery.addEventListener('change', orientationChange);
    window.addEventListener('blur', blur);
    const visibility = () => {
      if (document.hidden) blur();
    };
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('keydown', key);
    return () => {
      cancelAnimationFrame(raf);
      input.destroy();
      audio.destroy();
      renderer.destroy();
      window.removeEventListener('blur', blur);
      orientationQuery.removeEventListener('change', orientationChange);
      window.removeEventListener('keydown', key);
      document.removeEventListener('visibilitychange', visibility);
      runtime.current = null;
    };
  }, []);
  useEffect(() => {
    if (!remapping) return;
    const listener = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (e.code === 'Escape') {
        setRemapping(null);
        return;
      }
      const input = runtime.current?.input;
      if (input) {
        const conflict = Object.entries(input.bindings[remapping.slot]).find(
          ([a, key]) => key === e.code && a !== remapping.action,
        );
        const old = input.bindings[remapping.slot][remapping.action]!;
        if (conflict) input.bindings[remapping.slot][conflict[0]] = old;
        input.bindings[remapping.slot][remapping.action] = e.code;
        store('fame.bindings', JSON.stringify(input.bindings));
        input.clear();
      }
      setBindingRevision((x) => x + 1);
      setRemapping(null);
    };
    window.addEventListener('keydown', listener, true);
    return () => window.removeEventListener('keydown', listener, true);
  }, [remapping]);
  const start = () => {
    const rt = runtime.current;
    if (!rt) return;
    rt.input.clear();
    rt.audio.unlock();
    rt.renderer.setFighters(selected);
    rt.state = createMatch(content, selected, 42);
    rt.previous = rt.state;
    setSnapshot(rt.state);
    setPaused(false);
    setScreen('fight');
  };
  const goTitle = () => {
    const rt = runtime.current;
    if (rt) {
      rt.input.clear();
      rt.state = createMatch(content, selected, 42);
      rt.previous = rt.state;
      setSnapshot(rt.state);
    }
    setPaused(false);
    setDebug(false);
    setScreen('title');
  };
  const choose = (id: string) => {
    const next: [string, string] = [...selected];
    next[slot] = id;
    setSelected(next);
    if (slot === 0) setSlot(1);
  };
  const touch = (action: string, on: boolean) => {
    const input = runtime.current?.input;
    if (input) {
      if (on) input.touch.add(action);
      else input.touch.delete(action);
    }
  };
  const touchButton = (action: string, label: string, extra = '') => (
    <button
      key={action}
      className={`touch-button ${extra}`}
      aria-label={action}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        touch(action, true);
        runtime.current?.audio.unlock();
      }}
      onPointerUp={() => touch(action, false)}
      onPointerCancel={() => touch(action, false)}
      onLostPointerCapture={() => touch(action, false)}
    >
      {label}
    </button>
  );
  return (
    <main className={`app screen-${screen} ${reduced ? 'reduced' : ''}`}>
      <canvas ref={canvas} className="arena-canvas" aria-label="Fame Wars 3D arena" />
      <div className="vignette" />
      {screen !== 'fight' && (
        <header className="topbar">
          <a href="#" onClick={(e) => e.preventDefault()} className="wordmark">
            FW<span>✦</span>
          </a>
          <span className="build">{t.prototype}</span>
          <nav>
            <button className="language" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>
              {lang === 'en' ? 'हिन्दी' : 'English'}
            </button>
            <button
              className="icon-button"
              aria-label={t.settings}
              onClick={() => setSettings(true)}
            >
              ⚙
            </button>
          </nav>
        </header>
      )}
      {error ? (
        <section className="panel fatal">
          <h1>{t.unavailable}</h1>
          <p>{error}</p>
        </section>
      ) : null}
      {screen === 'disclaimer' && (
        <section className="overlay disclaimer">
          <div className="panel">
            <span className="eyebrow">BEFORE THE FIRST TAKE / पहली टेक से पहले</span>
            <h1>
              All fiction.
              <br />
              <em>All fun.</em>
            </h1>
            <p>{t.disclaimer}</p>
            <p lang={lang === 'en' ? 'hi' : 'en'}>{t.disclaimerhi}</p>
            <small>
              Private combat prototype · no accounts, ads or analytics. / निजी प्रोटोटाइप · कोई
              विज्ञापन या ट्रैकिंग नहीं।
            </small>
            <label className="check">
              <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} />
              {t.adult}
            </label>
            <button
              className="primary"
              disabled={!adult || !!error}
              onClick={() => {
                store('fame.disclaimer', '1');
                runtime.current?.audio.unlock();
                setScreen('title');
              }}
            >
              {t.continue} <span>↗</span>
            </button>
          </div>
        </section>
      )}
      {screen === 'title' && (
        <section className="title-screen">
          <div className="hero-copy">
            <div className="eyebrow">
              <i /> THE BACKLOT IS YOUR BATTLEGROUND
            </div>
            <h1 className="game-title">
              FAME
              <br />
              <span>WARS</span>
              <sup>✦</sup>
            </h1>
            <p className="tagline">{t.tagline}</p>
            <p className="description">
              {lang === 'en'
                ? 'Big egos. Bigger entrances. One spotlight.'
                : 'बड़े तेवर। धमाकेदार एंट्री। सुर्खियाँ बस एक की।'}
            </p>
            <button
              className="primary"
              disabled={!!error}
              onClick={() => {
                setSlot(0);
                setScreen('select');
                runtime.current?.audio.unlock();
              }}
            >
              {t.play}
              <span>↗</span>
            </button>
            <div className="hero-meta">
              <span>2 FIGHTERS</span>
              <b>✦</b>
              <span>45 SECOND ROUNDS</span>
              <b>✦</b>
              <span>NO GORE</span>
            </div>
          </div>
          <aside className="hero-ticket">
            <span>NOW SHOOTING</span>
            <strong>FILM CITY</strong>
            <small>STREET FIGHT · TAKE 01</small>
            <div className="ticket-line" />
            <p>
              100% ORIGINAL CHARACTERS
              <br />
              0% CELEBRITY DRAMA
            </p>
          </aside>
          <footer className="footer">
            <span>AN ORIGINAL ARCADE COMEDY</span>
            <span>KEYBOARD / GAMEPAD / TOUCH</span>
          </footer>
        </section>
      )}
      {screen === 'select' && (
        <section className="select-screen">
          <div className="select-heading">
            <span className="eyebrow">CASTING CALL / कास्टिंग कॉल</span>
            <h1>
              {t.select}
              <span className="lime">.</span>
            </h1>
            <p>{t.rules}</p>
          </div>
          <div className="select-layout">
            <div className="fighter-grid">
              {content.fighters.map((f, i) => (
                <button
                  className={`fighter-card ${selected[slot] === f.id ? 'chosen' : ''}`}
                  key={f.id}
                  onClick={() => choose(f.id)}
                  style={{ '--fighter': f.palette[0] } as React.CSSProperties}
                >
                  <div className="card-tags">
                    <span>0{i + 1}</span>
                    <span>
                      {selected[0] === f.id ? 'P1 ' : ''}
                      {selected[1] === f.id ? 'P2' : ''}
                    </span>
                  </div>
                  <div className…5146 tokens truncated…is.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas);
    this.resize();
  }
  setFighters(ids: [string, string]) {
    this.puppets.forEach((p) => {
      this.scene.remove(p.group);
      p.group.traverse((o) => {
        if (o instanceof THREE.Mesh)
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.dispose();
      });
    });
    this.puppets = ids.map((id) => fighter(content.fighters.find((f) => f.id === id)!)) as [
      Puppet,
      Puppet,
    ];
    this.puppets.forEach((p) => this.scene.add(p.group));
  }
  private resize() {
    const w = this.canvas.clientWidth,
      h = this.canvas.clientHeight;
    if (w && h) {
      this.engine.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }
  draw(s: MatchState, previous: MatchState, alpha: number) {
    const winner = s.winner === null ? null : s.actors[s.winner];
    const finish = s.phase === 'finisher' && !this.reduced;
    this.camera.position.set(
      finish && winner ? (winner.x / 1000) * 0.4 : 0,
      finish ? 2.7 : 3.6,
      finish ? 6.5 : Math.max(9.8, 8.5 / this.camera.aspect),
    );
    this.camera.lookAt(finish && winner ? (winner.x / 1000) * 0.7 : 0, 1.0, 0);
    this.puppets.forEach((p, i) => {
      const a = s.actors[i]!,
        old = previous.actors[i]!;
      p.group.position.set(
        (old.x + (a.x - old.x) * alpha) / 1000,
        (old.y + (a.y - old.y) * alpha) / 1000,
        0,
      );
      p.group.rotation.y = a.facing === 1 ? 0.3 : -0.3;
      p.group.visible = true;
      const poseData = pose(a, s.tick);
      p.body.position.y = poseData.crouch + (this.reduced ? 0 : poseData.bob);
      p.body.rotation.z = poseData.lean * a.facing;
      p.group.rotation.z = a.state === 'KO' ? -a.facing * 1.35 : 0;
      p.leftLeg.rotation.x = poseData.walk;
      p.rightLeg.rotation.x = -poseData.walk;
      p.leftArm.rotation.z = 0.18;
      p.rightArm.rotation.z = -0.18;
      const arm = a.facing === 1 ? p.rightArm : p.leftArm;
      arm.rotation.z =
        -a.facing *
        (a.state === 'block' ? 1.8 : a.state === 'finisher' ? 2.7 : poseData.strike * 1.6 + 0.18);
      if (a.move === 'kick')
        (a.facing === 1 ? p.rightLeg : p.leftLeg).rotation.z = -a.facing * poseData.strike * 1.3;
      p.body.visible = this.style === '3d';
      const hb = hurtbox(a, content),
        ab = attackbox(a, content);
      [hb, ab].forEach((b, k) => {
        const mesh = this.debugMeshes[i * 2 + k]!;
        mesh.visible = !!b && (this.debug || this.style === 'boxes');
        if (b) {
          mesh.position.set((b.x + b.w / 2) / 1000, (b.y + b.h / 2) / 1000, 0.4);
          mesh.scale.set(b.w / 1000, b.h / 1000, 1);
        }
      });
    });
    this.engine.render(this.scene, this.camera);
    this.drawCalls = this.engine.info.render.calls;
    this.triangles = this.engine.info.render.triangles;
  }
  destroy() {
    this.observer.disconnect();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          if ('map' in m) (m as THREE.MeshBasicMaterial).map?.dispose();
          m.dispose();
        }
      }
    });
    this.engine.dispose();
  }
}
