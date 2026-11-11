import { it, expect } from 'vitest';
import { content, FighterSchema, MoveSchema, BalanceSchema } from './index';
it('loads original-only validated fighters and references', () => {
  expect(content.fighters).toHaveLength(2);
  expect(content.fighters.every((f) => f.licenseStatus === 'original')).toBe(true);
  expect(() =>
    FighterSchema.parse({ ...content.fighters[0], licenseStatus: 'celebrity' }),
  ).toThrow();
});
it('rejects malformed frame data and unknown properties', () => {
  expect(() => MoveSchema.parse({ ...content.moves[0], startup: -1 })).toThrow();
  expect(() => MoveSchema.parse({ ...content.moves[0], script: 'evil' })).toThrow();
  expect(() => BalanceSchema.parse({ ...content.balance, bufferFrames: 0 })).toThrow();
});
