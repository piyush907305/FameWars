import { neutral, type Input } from '@fame/sim';
export type Bindings = Record<string, string>;
export const defaults: [Bindings, Bindings] = [
  {
    left: 'KeyA',
    right: 'KeyD',
    jump: 'KeyW',
    crouch: 'KeyS',
    block: 'KeyF',
    light: 'KeyJ',
    heavy: 'KeyK',
    kick: 'KeyL',
    dash: 'ShiftLeft',
    super: 'KeyU',
  },
  {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    jump: 'ArrowUp',
    crouch: 'ArrowDown',
    block: 'Numpad0',
    light: 'Numpad1',
    heavy: 'Numpad2',
    kick: 'Numpad3',
    dash: 'Numpad4',
    super: 'Numpad5',
  },
];
export const actionNames = [
  'left',
  'right',
  'jump',
  'crouch',
  'block',
  'light',
  'heavy',
  'kick',
  'dash',
  'super',
] as const;
export class InputManager {
  private padSlots: [number | null, number | null] = [null, null];
  keys = new Set<string>();
  touch = new Set<string>();
  bindings: [Bindings, Bindings] = structuredClone(defaults);
  constructor() {
    window.addEventListener('keydown', this.down);
    window.addEventListener('keyup', this.up);
    window.addEventListener('blur', this.clear);
    document.addEventListener('visibilitychange', this.clear);
  }
  private down = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
    if (
      [...Object.values(this.bindings[0]), ...Object.values(this.bindings[1]), 'Space'].includes(
        e.code,
      )
    ) {
      e.preventDefault();
      this.keys.add(e.code);
    }
  };
  private up = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };
  clear = () => {
    this.keys.clear();
    this.touch.clear();
  };
  sample(slot: 0 | 1, gamepads: Gamepad[]): Input {
    const n = neutral(),
      bind = this.bindings[slot];
    const pressed = (action: string) =>
      this.keys.has(bind[action] ?? '') || (slot === 0 && this.touch.has(action));
    let left = pressed('left'),
      right = pressed('right');
    for (const p of gamepads) {
      if (!this.padSlots.includes(p.index)) {
        const empty = this.padSlots.indexOf(null);
        if (empty >= 0) this.padSlots[empty as 0 | 1] = p.index;
      }
    }
    const pad = gamepads.find((p) => p.index === this.padSlots[slot]);
    if (pad) {
      left ||= (pad.axes[0] ?? 0) < -0.3 || !!pad.buttons[14]?.pressed;
      right ||= (pad.axes[0] ?? 0) > 0.3 || !!pad.buttons[15]?.pressed;
    }
    n.axis = left === right ? 0 : left ? -1 : 1;
    for (const key of [
      'jump',
      'crouch',
      'block',
      'light',
      'heavy',
      'kick',
      'dash',
      'super',
    ] as const)
      n[key] = pressed(key);
    if (pad) {
      n.jump ||= !!pad.buttons[0]?.pressed;
      n.light ||= !!pad.buttons[2]?.pressed;
      n.heavy ||= !!pad.buttons[3]?.pressed;
      n.kick ||= !!pad.buttons[1]?.pressed;
      n.block ||= !!pad.buttons[4]?.pressed;
      n.dash ||= !!pad.buttons[5]?.pressed;
      n.super ||= !!pad.buttons[7]?.pressed;
      n.crouch ||= (pad.axes[1] ?? 0) > 0.5 || !!pad.buttons[13]?.pressed;
    }
    n.skip = this.keys.has('Space');
    return n;
  }
  destroy() {
    window.removeEventListener('keydown', this.down);
    window.removeEventListener('keyup', this.up);
    window.removeEventListener('blur', this.clear);
    document.removeEventListener('visibilitychange', this.clear);
  }
}
