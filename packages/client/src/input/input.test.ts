import { it, expect, vi, afterEach } from 'vitest';
import { InputManager } from './index';
afterEach(() => vi.unstubAllGlobals());
function manager() {
  vi.stubGlobal('window', { addEventListener: () => {}, removeEventListener: () => {} });
  vi.stubGlobal('document', { addEventListener: () => {}, removeEventListener: () => {} });
  return new InputManager();
}
function pad(index: number, x: number): Gamepad {
  return { index, axes: [x, 0], buttons: [] } as unknown as Gamepad;
}
it('opposite keys cancel, touch is P1 only, clearing releases inputs', () => {
  const m = manager();
  m.keys.add('KeyA');
  m.keys.add('KeyD');
  expect(m.sample(0, []).axis).toBe(0);
  m.touch.add('light');
  expect(m.sample(0, []).light).toBe(true);
  expect(m.sample(1, []).light).toBe(false);
  m.clear();
  expect(m.sample(0, []).light).toBe(false);
});
it('gamepad assignment stays stable when the other controller disconnects', () => {
  const m = manager();
  expect(m.sample(0, [pad(2, 1), pad(5, -1)]).axis).toBe(1);
  expect(m.sample(1, [pad(2, 1), pad(5, -1)]).axis).toBe(-1);
  expect(m.sample(0, [pad(5, -1)]).axis).toBe(0);
  expect(m.sample(1, [pad(5, -1)]).axis).toBe(-1);
});
