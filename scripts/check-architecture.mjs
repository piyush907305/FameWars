import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';
const folder = 'packages/sim/src';
for (const file of readdirSync(folder).filter((f) => f.endsWith('.ts') && !f.includes('.test.'))) {
  const s = readFileSync(`${folder}/${file}`, 'utf8');
  assert(
    !/Math\.random|Date\.|performance\.|requestAnimationFrame|window\.|document\.|from ['"]three/.test(
      s,
    ),
    `Nondeterministic/render import in ${file}`,
  );
}
console.log(
  'Simulation boundary check passed. AI → sim types; client → sim/content/AI; sim → content types only.',
);
