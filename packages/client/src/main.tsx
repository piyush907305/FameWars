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
              Combat prototype · no accounts, ads or analytics. / कॉम्बैट प्रोटोटाइप · कोई
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
                  <div className={`portrait ${f.visual.prop}`}>
                    <div className="portrait-head">
                      <i />
                      <b />
                    </div>
                    <div className="portrait-body" />
                  </div>
                  <div className="card-info">
                    <small>{f.archetype.replace('-', ' ').toUpperCase()}</small>
                    <h2>{f.name[lang]}</h2>
                    <span>{lineFor(f.id, lang)}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="match-setup panel">
              <span className="eyebrow">SET THE SCENE</span>
              <div className="slot-tabs">
                {([0, 1] as const).map((i) => (
                  <button className={slot === i ? 'active' : ''} onClick={() => setSlot(i)} key={i}>
                    P{i + 1} · {content.fighters.find((f) => f.id === selected[i])!.name[lang]}
                  </button>
                ))}
              </div>
              <label>
                {lang === 'en' ? 'Match mode' : 'मुकाबले का मोड'}
                <select
                  aria-label="Match mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as typeof mode)}
                >
                  <option value="cpu">{t.cpu}</option>
                  <option value="local">{t.local}</option>
                </select>
              </label>
              {mode === 'cpu' && (
                <label>
                  {t.difficulty}
                  <select
                    aria-label="CPU difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  >
                    {(['easy', 'normal', 'hard'] as const).map((d) => (
                      <option key={d} value={d}>
                        {t[d]}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="arena-label">
                <span>LOCATION 01</span>
                <strong>{content.arena.name[lang]}</strong>
              </div>
              <button className="primary" onClick={start}>
                {t.start}
                <span>→</span>
              </button>
              <small>
                {lang === 'en'
                  ? 'Local 2P: shared keyboard or two gamepads. Touch: player 1.'
                  : 'लोकल 2P: कीबोर्ड या दो गेमपैड। टच: खिलाड़ी 1।'}
              </small>
              <button className="text-button" onClick={goTitle}>
                ← {t.back}
              </button>
            </div>
          </div>
        </section>
      )}
      {screen === 'fight' && (
        <>
          <section className="hud">
            {snapshot.actors.map((a, i) => {
              const def = content.fighters.find((f) => f.id === a.id)!;
              return (
                <div key={i} className={`fighter-hud player-${i}`}>
                  <div className="hud-name">
                    <span>
                      P{i + 1} {mode === 'cpu' && i === 1 ? '· CPU' : ''}
                    </span>
                    <strong>{def.name[lang]}</strong>
                    <div className="pips">
                      {[0, 1].map((n) => (
                        <i key={n} className={snapshot.wins[i]! > n ? 'filled' : ''} />
                      ))}
                    </div>
                  </div>
                  <div
                    className="healthbar"
                    role="meter"
                    aria-label={`P${i + 1} health`}
                    aria-valuenow={a.health}
                    aria-valuemin={0}
                    aria-valuemax={1000}
                  >
                    <div style={{ width: `${a.health / 10}%` }} />
                  </div>
                  <div className="sub-bars">
                    <label>
                      {t.stamina}
                      <div className="bar stamina">
                        <i style={{ width: `${a.stamina / 100}%` }} />
                      </div>
                    </label>
                    <label>
                      {t.meter}
                      <div className={`bar meter ${a.meter === 1000 ? 'ready' : ''}`}>
                        <i style={{ width: `${a.meter / 10}%` }} />
                      </div>
                    </label>
                  </div>
                </div>
              );
            })}
            <div className="timer">
              <small>
                {t.round} {snapshot.round}
              </small>
              <strong>
                {Math.max(0, Math.ceil(snapshot.remaining / 60))
                  .toString()
                  .padStart(2, '0')}
              </strong>
              <span>BEST OF 3</span>
            </div>
          </section>
          <div className="fight-tools">
            <button
              aria-label={t.pause}
              onClick={() => {
                setPaused(true);
                runtime.current?.input.clear();
              }}
            >
              Ⅱ
            </button>
            <button aria-label="Debug overlay" onClick={() => setDebug((x) => !x)}>
              ⌘
            </button>
          </div>
          <div className="arena-caption">
            FILM CITY <span>BACKLOT 07</span>
          </div>
          {snapshot.suddenDeath && snapshot.phase === 'fight' && (
            <div className="sudden">{t.sudden}</div>
          )}
          {snapshot.phase === 'finisher' && snapshot.winner !== null && (
            <section className="finisher-caption" aria-live="polite">
              <small>
                {
                  content.fighters.find((f) => f.id === snapshot.actors[snapshot.winner!].id)!.name[
                    lang
                  ]
                }{' '}
                · SPOTLIGHT MOMENT
              </small>
              <h2>“{lineFor(snapshot.actors[snapshot.winner!].id, lang)}”</h2>
              <button
                onClick={() => {
                  if (runtime.current) runtime.current.skip = true;
                }}
              >
                {t.skip} →
              </button>
            </section>
          )}
          {snapshot.phase === 'roundResult' && (
            <div className="round-result">
              {snapshot.winner === null ? t.draw : `P${snapshot.winner + 1} · ${t.win}`}
            </div>
          )}
          <div className="keyboard-hint">
            A D / W S · F block · J light · K heavy · L kick · Shift dash · U super{' '}
            <span>` DEBUG · ESC PAUSE</span>
          </div>
          <section className="touch-controls" role="region" aria-label="Touch controls">
            <div className="movement">
              {touchButton('jump', '↑')}
              {touchButton('left', '←')}
              {touchButton('crouch', '↓')}
              {touchButton('right', '→')}
            </div>
            <div className="actions">
              {touchButton('block', 'BLOCK')}
              {touchButton('dash', 'DASH')}
              {touchButton('light', 'LIGHT')}
              {touchButton('heavy', 'HEAVY')}
              {touchButton('kick', 'KICK')}
              {touchButton('super', 'SUPER', 'super-button')}
            </div>
          </section>
        </>
      )}
      {screen === 'result' && (
        <section className="overlay result-screen">
          <div className="panel">
            <span className="eyebrow">
              FINAL TAKE · {snapshot.wins[0]} : {snapshot.wins[1]}
            </span>
            <h1>{t.results}</h1>
            <div className="result-star">✦</div>
            <h2>
              {
                content.fighters.find((f) => f.id === snapshot.actors[snapshot.winner ?? 0].id)!
                  .name[lang]
              }
            </h2>
            <p>{t.win}</p>
            <button className="primary" onClick={start}>
              {t.rematch} ↗
            </button>
            <button className="text-button" onClick={goTitle}>
              {t.menu}
            </button>
          </div>
        </section>
      )}
      {paused && screen === 'fight' && !settings && (
        <section className="overlay pause-screen">
          <div className="panel">
            <span className="eyebrow">HOLD THE CAMERA</span>
            <h1>{t.pause}</h1>
            <button
              className="primary"
              onClick={() => {
                runtime.current?.input.clear();
                setPaused(false);
              }}
            >
              {t.resume} →
            </button>
            <button className="secondary" onClick={() => setSettings(true)}>
              {t.settings}
            </button>
            <button
              className="text-button"
              onClick={() => {
                setPaused(false);
                setScreen('title');
              }}
            >
              {t.menu}
            </button>
          </div>
        </section>
      )}
      {settings && (
        <section className="overlay settings-screen">
          <div className="panel settings-panel">
            <div className="panel-heading">
              <h1>{t.settings}</h1>
              <button
                className="icon-button"
                aria-label="Close settings"
                onClick={() => {
                  setSettings(false);
                  setRemapping(null);
                }}
              >
                ×
              </button>
            </div>
            <label>
              {t.volume}
              <input
                aria-label="Volume"
                type="range"
                min="0"
                max="1"
                step=".05"
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  store('fame.volume', e.target.value);
                  runtime.current?.audio.unlock();
                }}
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => {
                  setReduced(e.target.checked);
                  store('fame.reduced', e.target.checked ? '1' : '0');
                }}
              />
              {t.motion}
            </label>
            <p className="setting-note">
              {t.subtitles} · Gamepad: A jump / X light / Y heavy / B kick / LB block / RB dash / RT
              super.
            </p>
            <h2>{t.controls}</h2>
            <div className="bindings" key={bindingRevision}>
              {([0, 1] as const).map((player) => (
                <div key={player}>
                  <h3>P{player + 1}</h3>
                  {actionNames.map((a) => (
                    <button key={a} onClick={() => setRemapping({ slot: player, action: a })}>
                      <span>{a}</span>
                      <kbd>
                        {remapping?.slot === player && remapping.action === a
                          ? t.press
                          : (runtime.current?.input.bindings[player][a] ?? defaults[player][a])
                              ?.replace('Key', '')
                              .replace('Arrow', '')}
                      </kbd>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <button
              className="secondary"
              onClick={() => {
                if (runtime.current) runtime.current.input.bindings = structuredClone(defaults);
                store('fame.bindings', JSON.stringify(defaults));
                setBindingRevision((x) => x + 1);
              }}
            >
              {t.reset}
            </button>
          </div>
        </section>
      )}
      {debug && (
        <pre className="debug-overlay">{`SIM 60 Hz · FRAME ${snapshot.tick}
FPS ${fps} · ${draws} draws
${snapshot.phase} · seed ${snapshot.rng}
${snapshot.actors.map((a) => `${a.id}: ${a.state} ${a.move ?? ''} ${a.moveFrame} · x=${a.x} y=${a.y}`).join('\n')}`}</pre>
      )}
      <div className="rotate-prompt">
        <span>↻</span>
        <h2>{t.rot}</h2>
        <p>{t.rotbody}</p>
      </div>
    </main>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
