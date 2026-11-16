import { cpuInput } from '@fame/ai';
import { content } from '@fame/content';
import { createMatch, step } from '@fame/sim';
import { Renderer } from './render';
import { InputManager } from './input';
const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const renderer = new Renderer(canvas, ['dynamo', 'chalk']);
renderer.style = new URLSearchParams(location.search).get('art') === '3d' ? '3d' : 'boxes';
renderer.debug = true;
const input = new InputManager();
let state = createMatch(content),
  prev = state,
  last = performance.now(),
  acc = 0;
document.querySelector('#reset')!.addEventListener('click', () => {
  state = createMatch(content);
  prev = state;
});
function frame(now: number) {
  acc += Math.min(100, now - last);
  last = now;
  let n = 0;
  while (acc >= 1000 / 60 && n++ < 5) {
    prev = state;
    state = step(
      state,
      [
        input.sample(0, []),
        new URLSearchParams(location.search).has('cpu')
          ? cpuInput(state, 1, 'normal')
          : input.sample(1, []),
      ],
      content,
    );
    acc -= 1000 / 60;
  }
  renderer.draw(state, prev, Math.min(1, acc / (1000 / 60)));
  document.querySelector('#stats')!.textContent =
    `FAME WARS · COMBAT LAB\n${renderer.style} · tick ${state.tick} · ${state.phase}\nP1: A D / W S / F block / J K L / Shift dash / U super\nP2: arrows / numpad 0 block / 1 2 3 / 4 dash / 5 super\n${state.actors.map((a) => `${a.id}: ${a.state} · HP ${a.health} · STA ${a.stamina} · METER ${a.meter}`).join('\n')}`;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
